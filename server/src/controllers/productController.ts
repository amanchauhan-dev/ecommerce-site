// src/controllers/productController.ts
import { Request, Response } from 'express';
import pool from '../db/config';
import FieldValidation from '../functions/FieldValidation';
import SlugMaker from '../functions/SlugMake';
import path from 'path';
import fs from 'fs'

export const createProduct = async (req: Request, res: Response) => {
    if (!FieldValidation(req, res)) return;
    const { product_name, category_id, description, price, stock_quantity, status, variants } = req.body;
    try {
        const slug = SlugMaker(product_name)
        const [duplicateTitle] = await pool.query('SELECT id FROM products WHERE url_slug = ?', [slug]);
        if ((duplicateTitle as any).length > 0) {
            throw new RangeError('Title already exits.')
        }
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[] | undefined;
        };

        //  file images
        const product_thumbnail = files.product_thumbnail ? files.product_thumbnail[0].filename : null;
        const product_images = files.product_image ? files.product_image.map(e => e.filename) : null;

        // save the product data 
        const [result] = await pool.query(
            `INSERT INTO products (product_name,product_thumbnail, url_slug, category_id, description, price, stock_quantity, status) 
             VALUES (?,?, ?, ?, ?, ?, ?, ?)`,
            [product_name, product_thumbnail || null, slug, category_id || null, description, price, stock_quantity, status || 'inactive']
        );
        let productId = (result as any).insertId;
        // save the product images
        const imageValues = product_images ? product_images.map((image) => [productId, image]) : null;

        if (imageValues) {
            await pool.query(
                'INSERT INTO product_images (product_id, image_name) VALUES ?',
                [imageValues]
            );
        }
        // save variants
        if (variants) {
            let variantsArr: { color?: string; size?: string; stock_quantity?: number; price?: number }[] = JSON.parse(variants);
            const variantsValue = variantsArr ? variantsArr.map((val, index) => [productId, val.color, val.size, val.price, val.stock_quantity]) : null;
            if (variantsValue) {
                await pool.query(
                    'INSERT INTO product_variants (product_id, color, size, price, stock_quantity) VALUES ?',
                    [variantsValue]
                );
            }
        }

        res.status(201).json({ message: 'Product created successfully', productId: productId });
    } catch (error) {
        if (error instanceof RangeError) {
            res.status(409).json({ message: 'Title already exits.', error });
        } else {
            res.status(500).json({ message: 'Database error', error });
        }
    }
};

// Get all products
export const getProducts = async (req: Request, res: Response) => {
    try {
        // Extract query parameters
        const { status, page = 1, limit = 50, sort = 'asc', category_id, search } = req.query;
        // Base query
        let countQuery = 'SELECT COUNT(id) as total FROM products p WHERE 1=1';
        let query = `
        SELECT p.*, c.category_name
        FROM products p 
        LEFT JOIN categories c
            ON p.category_id = c.id
        WHERE 1=1`;
        const queryParams: any[] = [];
        // search 
        if (search) {
            countQuery += ' AND p.product_name LIKE  ?';
            query += ' AND p.product_name LIKE ?';
            let searchTerm = `%${search}%`
            queryParams.push(searchTerm);
        }


        // Filtering
        if (status) {
            countQuery += ' AND p.status = ?';
            query += ' AND p.status = ?';
            queryParams.push(status);
        }
        if (category_id) {
            countQuery += ' AND p.category_id = ?';
            query += ' AND p.category_id = ?';
            queryParams.push(category_id);
        }

        // order by 
        if (sort.toLocaleString().toLocaleLowerCase() == 'asc') {
            query += ' ORDER BY p.id ASC ';
        } else if (sort.toLocaleString().toLocaleLowerCase() == 'category_name') {
            query += ' ORDER BY c.category_name ASC ';
        } else if (sort.toLocaleString().toLocaleLowerCase() == 'price') {
            query += ' ORDER BY p.price ASC ';
        } else if (sort.toLocaleString().toLocaleLowerCase() == 'stock_quantity') {
            query += ' ORDER BY p.stock_quantity ASC ';
        } else {
            query += ' ORDER BY p.id DESC ';
        }

        // count query
        let countQueryParams = queryParams
        // Pagination
        const offset = (Number(page) - 1) * Number(limit);
        queryParams.push(Number(limit), offset);
        query += ' LIMIT ? OFFSET ?';


        // execute count query
        const [count] = await pool.query(countQuery, countQueryParams);
        // Execute query
        const [results] = await pool.query(query, queryParams);
        res.json({ data: results, page: Number(page), limit: Number(limit), total: (count as any[])[0].total });
    } catch (error: any) {
        res.status(500).json({ message: 'An error occurred while fetching products.', error });
    }
};


// get One product
export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT p.*, c.category_name, 
            CONCAT("[", GROUP_CONCAT(CONCAT('"',i.image_name,'"') SEPARATOR ","), "]") as images
            FROM products p 
            LEFT JOIN categories c
                ON p.category_id = c.id
            LEFT JOIN product_images i
                ON i.product_id = p.id
            WHERE p.id = ?`,
            [id]);
        const [fetchVariants] = await pool.query(`SELECT * FROM product_variants WHERE product_id = ?`, [id]);
        if ((rows as any).length === 0 || (rows as any)[0].id === null) {
            return res.status(404).json({ error: 'Product not found' });
        }
        let data = {
            ...(rows as any)[0],
            images: JSON.parse((rows as any)[0].images),
            variants: (fetchVariants as any),
        }
        res.json({ data: data });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};


// update
export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!FieldValidation(req, res)) return;
    const { product_name, category_id, description, price, stock_quantity, status, variants } = req.body;
    try {
        // image : product_thumbnail
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[] | undefined;
        };

        //  file images
        const product_thumbnail = files.product_thumbnail ? files.product_thumbnail[0].filename : null;
        const product_images = files.product_image ? files.product_image.map(e => e.filename) : null;
        // replace product thumbnail image
        if (product_thumbnail) {
            let [prevThumbnail] = await pool.query('SELECT product_thumbnail FROM products WHERE id=?', [id])
            if ((prevThumbnail as any[]).length > 0) {
                let filePath = path.join(__dirname, '../../public', 'uploads', (prevThumbnail as any)[0].product_thumbnail)
                fs.access(filePath, fs.constants.F_OK, err => {
                    if (!err) {
                        fs.unlink(filePath, err => {
                            if (err)
                                console.log('Error found in unlinking the previous product thumbnail', err);
                        })
                    }
                })
                await pool.query('UPDATE products SET product_thumbnail = ? WHERE id = ?', [product_thumbnail, id])
            }
        }
        // replace product images
        if (product_images) {
            let [prevImages] = await pool.query('SELECT image_name FROM product_images WHERE product_id =?', [id])
            let [deletePrev] = await pool.query('DELETE FROM product_images WHERE product_id =?', [id])
            let images = prevImages as any[]
            if (images.length > 0) {
                // remove prev images
                images.forEach(e => {
                    let filePath = path.join(__dirname, '../../public', 'uploads', e.image_name)
                    fs.access(filePath, fs.constants.F_OK, err => {
                        if (!err) {
                            fs.unlink(filePath, err => {
                                if (err) {
                                    console.log('Error found in unlinking images', err);
                                }
                            })
                        }
                    })
                })
                // upload new images
                let newImages = product_images as any[]
                if (newImages.length > 0) {
                    let imagesParams = newImages ? newImages.map(e => [id, e]) : null
                    await pool.query('INSERT INTO product_images(product_id,image_name) VALUES ?', [imagesParams])
                }
            }
        }

        // any field found
        let query = `UPDATE products SET `;
        let queryParams: any = []
        if (product_name) {
            query += "product_name = ?, ";
            queryParams.push(product_name)
        }
        if (category_id) {
            query += "category_id= ?, ";
            queryParams.push(category_id)
        }
        if (description) {
            query += "description = ?, ";
            queryParams.push(description)
        }
        if (price) {
            query += "price = ?, ";
            queryParams.push(price)
        }
        if (stock_quantity) {
            query += "stock_quantity = ?, ";
            queryParams.push(stock_quantity)
        }
        if (status) {
            query += "status = ?, ";
            queryParams.push(status)
        }

        // remove last comma
        query = query.slice(0, -2)
        // if nothing is to update
        if (queryParams.length == 0) {
            throw new TypeError('No fields to update');
        }

        // update condition
        query += 'WHERE id=? '
        queryParams.push(id)


        const [rows] = await pool.query(query, queryParams)

        if ((rows as any).affectedRows == 0) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        // update variants
        if (variants) {
            let variances = JSON.parse(variants) as { id?: number; color?: string; size?: string; stock_quantity?: number; price?: string }[] || []
            let newVariance: { color?: string; size?: string; stock_quantity?: number; price?: string }[] = variances
                .filter(item => item.id == undefined) // Filter objects that have `id`
                .map(item => item);
            const ids: number[] = variances
                .filter(item => item.id != undefined) // Filter objects that have `id`
                .map(item => item.id as number);
            // delete if any deleted
            if (ids.length > 0) {
                let [deletedData] = await pool.query('DELETE FROM product_variants WHERE product_id=? AND id NOT IN ?', [id, [ids]])
            }
            // save id any new added
            if (newVariance && newVariance.length > 0) {
                const variantsValue = newVariance.map((val, index) => [id, val.color, val.size, val.price, val.stock_quantity]);
                if (variantsValue) {
                    await pool.query(
                        'INSERT INTO product_variants (product_id, color, size, price, stock_quantity) VALUES ?',
                        [variantsValue]
                    );
                }
            }
        }

        res.json({ message: 'Product updated successfully', rows });
    } catch (error: any) {
        console.log('err', error);
        if (error instanceof TypeError) {
            res.status(400).json({ message: 'No fields to update', error });
        } else {
            res.status(500).json({ message: 'Internal Server error', error });
        }
    }
};

// delete

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const conn = await pool.getConnection()
    let imagesList: string[] = [];
    let avatarName: string | null = null;
    try {
        conn.beginTransaction()
        // retrieve all the images product have
        let [images] = await conn.query('SELECT image_name FROM product_images WHERE product_id=?', [id]);
        imagesList = (images as any[]).map(e => e.image_name)
        let [avatar] = await conn.query('SELECT product_thumbnail FROM products WHERE id=?', [id])
        avatarName = (avatar as any[])[0].product_thumbnail

        // delete variants 
        await conn.query('DELETE FROM product_variants WHERE product_id=?', [id])
        // delete product
        const [result] = await conn.query('DELETE FROM products WHERE id = ?', [id]);
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        // delete images product have
        // delete all
        if (imagesList.length > 0) {
            imagesList.forEach(e => {
                let filePath = path.join(__dirname, '../../public', 'uploads', e)
                fs.access(filePath, fs.constants.F_OK, err => {
                    if (!err) {
                        fs.unlink(filePath, err => {
                            if (err) {
                                console.log('Error found in unlinking images', err);
                            }
                        })
                    }
                })
            })
        }
        // delete thumbnail
        if (avatarName !== null) {
            let filePath = path.join(__dirname, '../../public', 'uploads', avatarName)
            fs.access(filePath, fs.constants.F_OK, err => {
                if (!err) {
                    fs.unlink(filePath, err => {
                        if (err) {
                            console.log('Error found in unlinking images', err);
                        }
                    })
                }
            })

        }
        // response
        res.json({ message: 'Product deleted successfully' });

    } catch (error) {
        conn.rollback()
        res.status(500).json({ error: 'Database error' });
    } finally {
        conn.release()
    }
};
