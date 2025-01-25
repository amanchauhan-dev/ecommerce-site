import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import pool from '../db/config';
import FieldValidation from '../functions/FieldValidation';
import SlugMaker from '../functions/SlugMake';

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
    if (!FieldValidation(req, res)) return;
    const { category_name, parent_cat_id, status } = req.body;

    try {
        let isSub = false;
        let slug = SlugMaker(category_name)
        if (parent_cat_id) {
            isSub = true;
        }
        const [result] = await pool.query(
            `INSERT INTO categories (category_name,isSub, url_slug, parent_cat_id, status) VALUES (?,?, ?, ?, ?)`,
            [category_name, isSub, slug, parent_cat_id || null, status || 'active']
        );
        res.status(201).json({ message: 'Category created successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
};

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
    try {
        // Extract query parameters
        const { status, page = 1, limit = 50, order = 'asc', parentId, isSub } = req.query;

        // Base query
        let countQuery = 'SELECT COUNT(id) as total FROM categories c WHERE 1=1';
        let query = `
        SELECT c.id,c.url_slug,c.isSub, c.category_name,c.status,c.created_at,c.updated_at,c1.category_name as parent_name 
        FROM categories c 
        LEFT JOIN categories c1 
        ON c1.id = c.parent_cat_id 
        WHERE 1=1`;
        const queryParams: any[] = [];
        // Filtering
        if (status) {
            countQuery += ' AND c.status = ?';
            query += ' AND c.status = ?';
            queryParams.push(status);
        }
        if (parentId) {
            countQuery += ' AND c.parent_cat_id = ?';
            query += ' AND c.parent_cat_id = ?';
            queryParams.push(parentId);
        } else if (isSub) {
            if (isSub == '1') {
                countQuery += ' AND c.isSub=?';
                query += ' AND c.isSub=?';
                // fetch parents
                queryParams.push(true);
            } else {
                countQuery += ' AND c.isSub=?';
                query += ' AND c.isSub=?';
                // fetch sub categories
                queryParams.push(false);
            }
        }

        // order by 
        if (order.toLocaleString().toLocaleLowerCase() == 'asc') {
            countQuery += ' ORDER BY c.id ASC ';
            query += ' ORDER BY c.id ASC ';
        } else if (order.toLocaleString().toLocaleLowerCase() == 'category_name') {
            countQuery += ' ORDER BY c.category_name ASC ';
            query += ' ORDER BY c.category_name ASC ';
        } else if (order.toLocaleString().toLocaleLowerCase() == 'type') {
            countQuery += ' ORDER BY c.isSub ASC ';
            query += ' ORDER BY c.isSub ASC ';
        } else {
            countQuery += ' ORDER BY c.id DESC ';
            query += ' ORDER BY c.id DESC ';
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
        res.status(500).json({ message: 'An error occurred while fetching categories.', error });
    }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const [categories] = await pool.query(`
            SELECT c.id,c.url_slug, c.category_name,c.status,c.created_at,c.updated_at,c1.category_name as parent_name 
            FROM categories c 
            LEFT JOIN categories c1 
            ON c1.id = c.parent_cat_id 
            WHERE c.id=?`, [id]);
        if (!(categories as any[]).length) return res.status(404).json({ error: 'Category not found' });

        res.json((categories as any[])[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch category' });
    }
};

// Update category
export const updateCategory = async (req: Request, res: Response) => {
    if (!FieldValidation(req, res)) return;
    const { id } = req.params;
    const { category_name, status } = req.body;
    try {
        let slug = SlugMaker(category_name)
        const [result] = await pool.query(
            `UPDATE categories SET category_name = ?, url_slug = ?, status = ? WHERE id = ?`,
            [category_name, slug, status, id]
        );

        if ((result as any).affectedRows === 0) return res.status(404).json({ error: 'Category not found' });
        res.json({ message: 'Category updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);

        if ((result as any).affectedRows === 0) return res.status(404).json({ error: 'Category not found' });
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
