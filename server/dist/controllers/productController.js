"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const config_1 = __importDefault(require("../db/config"));
const FieldValidation_1 = __importDefault(require("../functions/FieldValidation"));
const SlugMake_1 = __importDefault(require("../functions/SlugMake"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, FieldValidation_1.default)(req, res))
        return;
    const { product_name, category_id, description, price, stock_quantity, status, variants } = req.body;
    try {
        const slug = (0, SlugMake_1.default)(product_name);
        const [duplicateTitle] = yield config_1.default.query('SELECT id FROM products WHERE url_slug = ?', [slug]);
        if (duplicateTitle.length > 0) {
            throw new RangeError('Title already exits.');
        }
        const files = req.files;
        //  file images
        const product_thumbnail = files.product_thumbnail ? files.product_thumbnail[0].filename : null;
        const product_images = files.product_image ? files.product_image.map(e => e.filename) : null;
        // save the product data 
        const [result] = yield config_1.default.query(`INSERT INTO products (product_name,product_thumbnail, url_slug, category_id, description, price, stock_quantity, status) 
             VALUES (?,?, ?, ?, ?, ?, ?, ?)`, [product_name, product_thumbnail || null, slug, category_id || null, description, price, stock_quantity, status || 'inactive']);
        let productId = result.insertId;
        // save the product images
        const imageValues = product_images ? product_images.map((image) => [productId, image]) : null;
        if (imageValues) {
            yield config_1.default.query('INSERT INTO product_images (product_id, image_name) VALUES ?', [imageValues]);
        }
        // save variants
        if (variants) {
            let variantsArr = JSON.parse(variants);
            const variantsValue = variantsArr ? variantsArr.map((val, index) => [productId, val.color, val.size, val.price, val.stock_quantity]) : null;
            if (variantsValue) {
                yield config_1.default.query('INSERT INTO product_variants (product_id, color, size, price, stock_quantity) VALUES ?', [variantsValue]);
            }
        }
        res.status(201).json({ message: 'Product created successfully', productId: productId });
    }
    catch (error) {
        if (error instanceof RangeError) {
            res.status(409).json({ message: 'Title already exits.', error });
        }
        else {
            res.status(500).json({ message: 'Database error', error });
        }
    }
});
exports.createProduct = createProduct;
// Get all products
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const queryParams = [];
        // search 
        if (search) {
            countQuery += ' AND p.product_name LIKE  ?';
            query += ' AND p.product_name LIKE ?';
            let searchTerm = `%${search}%`;
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
        }
        else if (sort.toLocaleString().toLocaleLowerCase() == 'category_name') {
            query += ' ORDER BY c.category_name ASC ';
        }
        else if (sort.toLocaleString().toLocaleLowerCase() == 'price') {
            query += ' ORDER BY p.price ASC ';
        }
        else if (sort.toLocaleString().toLocaleLowerCase() == 'stock_quantity') {
            query += ' ORDER BY p.stock_quantity ASC ';
        }
        else {
            query += ' ORDER BY p.id DESC ';
        }
        // count query
        let countQueryParams = queryParams;
        // Pagination
        const offset = (Number(page) - 1) * Number(limit);
        queryParams.push(Number(limit), offset);
        query += ' LIMIT ? OFFSET ?';
        // execute count query
        const [count] = yield config_1.default.query(countQuery, countQueryParams);
        // Execute query
        const [results] = yield config_1.default.query(query, queryParams);
        res.json({ data: results, page: Number(page), limit: Number(limit), total: count[0].total });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching products.', error });
    }
});
exports.getProducts = getProducts;
// get One product
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [rows] = yield config_1.default.query(`
            SELECT p.*, c.category_name, 
            CONCAT("[", GROUP_CONCAT(CONCAT('"',i.image_name,'"') SEPARATOR ","), "]") as images
            FROM products p 
            LEFT JOIN categories c
                ON p.category_id = c.id
            LEFT JOIN product_images i
                ON i.product_id = p.id
            WHERE p.id = ?`, [id]);
        const [fetchVariants] = yield config_1.default.query(`SELECT * FROM product_variants WHERE product_id = ?`, [id]);
        if (rows.length === 0 || rows[0].id === null) {
            return res.status(404).json({ error: 'Product not found' });
        }
        let data = Object.assign(Object.assign({}, rows[0]), { images: JSON.parse(rows[0].images), variants: fetchVariants });
        res.json({ data: data });
    }
    catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});
exports.getProductById = getProductById;
// update
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!(0, FieldValidation_1.default)(req, res))
        return;
    const { product_name, category_id, description, price, stock_quantity, status, variants } = req.body;
    try {
        // image : product_thumbnail
        const files = req.files;
        //  file images
        const product_thumbnail = files.product_thumbnail ? files.product_thumbnail[0].filename : null;
        const product_images = files.product_image ? files.product_image.map(e => e.filename) : null;
        // replace product thumbnail image
        if (product_thumbnail) {
            let [prevThumbnail] = yield config_1.default.query('SELECT product_thumbnail FROM products WHERE id=?', [id]);
            if (prevThumbnail.length > 0) {
                let filePath = path_1.default.join(__dirname, '../../public', 'uploads', prevThumbnail[0].product_thumbnail);
                fs_1.default.access(filePath, fs_1.default.constants.F_OK, err => {
                    if (!err) {
                        fs_1.default.unlink(filePath, err => {
                            if (err)
                                console.log('Error found in unlinking the previous product thumbnail', err);
                        });
                    }
                });
                yield config_1.default.query('UPDATE products SET product_thumbnail = ? WHERE id = ?', [product_thumbnail, id]);
            }
        }
        // replace product images
        if (product_images) {
            let [prevImages] = yield config_1.default.query('SELECT image_name FROM product_images WHERE product_id =?', [id]);
            let [deletePrev] = yield config_1.default.query('DELETE FROM product_images WHERE product_id =?', [id]);
            let images = prevImages;
            if (images.length > 0) {
                // remove prev images
                images.forEach(e => {
                    let filePath = path_1.default.join(__dirname, '../../public', 'uploads', e.image_name);
                    fs_1.default.access(filePath, fs_1.default.constants.F_OK, err => {
                        if (!err) {
                            fs_1.default.unlink(filePath, err => {
                                if (err) {
                                    console.log('Error found in unlinking images', err);
                                }
                            });
                        }
                    });
                });
                // upload new images
                let newImages = product_images;
                if (newImages.length > 0) {
                    let imagesParams = newImages ? newImages.map(e => [id, e]) : null;
                    yield config_1.default.query('INSERT INTO product_images(product_id,image_name) VALUES ?', [imagesParams]);
                }
            }
        }
        // any field found
        let query = `UPDATE products SET `;
        let queryParams = [];
        if (product_name) {
            query += "product_name = ?, ";
            queryParams.push(product_name);
        }
        if (category_id) {
            query += "category_id= ?, ";
            queryParams.push(category_id);
        }
        if (description) {
            query += "description = ?, ";
            queryParams.push(description);
        }
        if (price) {
            query += "price = ?, ";
            queryParams.push(price);
        }
        if (stock_quantity) {
            query += "stock_quantity = ?, ";
            queryParams.push(stock_quantity);
        }
        if (status) {
            query += "status = ?, ";
            queryParams.push(status);
        }
        // remove last comma
        query = query.slice(0, -2);
        // if nothing is to update
        if (queryParams.length == 0) {
            throw new TypeError('No fields to update');
        }
        // update condition
        query += 'WHERE id=? ';
        queryParams.push(id);
        const [rows] = yield config_1.default.query(query, queryParams);
        if (rows.affectedRows == 0) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        // update variants
        if (variants) {
            let variances = JSON.parse(variants) || [];
            let newVariance = variances
                .filter(item => item.id == undefined) // Filter objects that have `id`
                .map(item => item);
            const ids = variances
                .filter(item => item.id != undefined) // Filter objects that have `id`
                .map(item => item.id);
            // delete if any deleted
            if (ids.length > 0) {
                let [deletedData] = yield config_1.default.query('DELETE FROM product_variants WHERE product_id=? AND id NOT IN ?', [id, [ids]]);
            }
            // save id any new added
            if (newVariance && newVariance.length > 0) {
                const variantsValue = newVariance.map((val, index) => [id, val.color, val.size, val.price, val.stock_quantity]);
                if (variantsValue) {
                    yield config_1.default.query('INSERT INTO product_variants (product_id, color, size, price, stock_quantity) VALUES ?', [variantsValue]);
                }
            }
        }
        res.json({ message: 'Product updated successfully', rows });
    }
    catch (error) {
        console.log('err', error);
        if (error instanceof TypeError) {
            res.status(400).json({ message: 'No fields to update', error });
        }
        else {
            res.status(500).json({ message: 'Internal Server error', error });
        }
    }
});
exports.updateProduct = updateProduct;
// delete
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const conn = yield config_1.default.getConnection();
    let imagesList = [];
    let avatarName = null;
    try {
        conn.beginTransaction();
        // retrieve all the images product have
        let [images] = yield conn.query('SELECT image_name FROM product_images WHERE product_id=?', [id]);
        imagesList = images.map(e => e.image_name);
        let [avatar] = yield conn.query('SELECT product_thumbnail FROM products WHERE id=?', [id]);
        avatarName = avatar[0].product_thumbnail;
        // delete variants 
        yield conn.query('DELETE FROM product_variants WHERE product_id=?', [id]);
        // delete product
        const [result] = yield conn.query('DELETE FROM products WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        // delete images product have
        // delete all
        if (imagesList.length > 0) {
            imagesList.forEach(e => {
                let filePath = path_1.default.join(__dirname, '../../public', 'uploads', e);
                fs_1.default.access(filePath, fs_1.default.constants.F_OK, err => {
                    if (!err) {
                        fs_1.default.unlink(filePath, err => {
                            if (err) {
                                console.log('Error found in unlinking images', err);
                            }
                        });
                    }
                });
            });
        }
        // delete thumbnail
        if (avatarName !== null) {
            let filePath = path_1.default.join(__dirname, '../../public', 'uploads', avatarName);
            fs_1.default.access(filePath, fs_1.default.constants.F_OK, err => {
                if (!err) {
                    fs_1.default.unlink(filePath, err => {
                        if (err) {
                            console.log('Error found in unlinking images', err);
                        }
                    });
                }
            });
        }
        // response
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        conn.rollback();
        res.status(500).json({ error: 'Database error' });
    }
    finally {
        conn.release();
    }
});
exports.deleteProduct = deleteProduct;
