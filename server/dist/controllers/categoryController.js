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
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const config_1 = __importDefault(require("../db/config"));
const FieldValidation_1 = __importDefault(require("../functions/FieldValidation"));
const SlugMake_1 = __importDefault(require("../functions/SlugMake"));
// Create a new category
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, FieldValidation_1.default)(req, res))
        return;
    const { category_name, parent_cat_id, status } = req.body;
    try {
        let isSub = false;
        let slug = (0, SlugMake_1.default)(category_name);
        if (parent_cat_id) {
            isSub = true;
        }
        const [result] = yield config_1.default.query(`INSERT INTO categories (category_name,isSub, url_slug, parent_cat_id, status) VALUES (?,?, ?, ?, ?)`, [category_name, isSub, slug, parent_cat_id || null, status || 'active']);
        res.status(201).json({ message: 'Category created successfully', data: result });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
});
exports.createCategory = createCategory;
// Get all categories
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const queryParams = [];
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
        }
        else if (isSub) {
            if (isSub == '1') {
                countQuery += ' AND c.isSub=?';
                query += ' AND c.isSub=?';
                // fetch parents
                queryParams.push(true);
            }
            else {
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
        }
        else if (order.toLocaleString().toLocaleLowerCase() == 'category_name') {
            countQuery += ' ORDER BY c.category_name ASC ';
            query += ' ORDER BY c.category_name ASC ';
        }
        else if (order.toLocaleString().toLocaleLowerCase() == 'type') {
            countQuery += ' ORDER BY c.isSub ASC ';
            query += ' ORDER BY c.isSub ASC ';
        }
        else {
            countQuery += ' ORDER BY c.id DESC ';
            query += ' ORDER BY c.id DESC ';
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
        res.status(500).json({ message: 'An error occurred while fetching categories.', error });
    }
});
exports.getCategories = getCategories;
// Get category by ID
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [categories] = yield config_1.default.query(`
            SELECT c.id,c.url_slug, c.category_name,c.status,c.created_at,c.updated_at,c1.category_name as parent_name 
            FROM categories c 
            LEFT JOIN categories c1 
            ON c1.id = c.parent_cat_id 
            WHERE c.id=?`, [id]);
        if (!categories.length)
            return res.status(404).json({ error: 'Category not found' });
        res.json(categories[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch category' });
    }
});
exports.getCategoryById = getCategoryById;
// Update category
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, FieldValidation_1.default)(req, res))
        return;
    const { id } = req.params;
    const { category_name, status } = req.body;
    try {
        let slug = (0, SlugMake_1.default)(category_name);
        const [result] = yield config_1.default.query(`UPDATE categories SET category_name = ?, url_slug = ?, status = ? WHERE id = ?`, [category_name, slug, status, id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ error: 'Category not found' });
        res.json({ message: 'Category updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
});
exports.updateCategory = updateCategory;
// Delete category
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [result] = yield config_1.default.query('DELETE FROM categories WHERE id = ?', [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ error: 'Category not found' });
        res.json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
});
exports.deleteCategory = deleteCategory;
