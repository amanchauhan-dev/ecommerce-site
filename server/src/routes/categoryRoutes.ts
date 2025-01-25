import express from 'express';
import { body, param } from 'express-validator';
import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController';
import { isAdmin, isEmployee, verifyToken } from '../middleware/middleware';

const router = express.Router();


// validations
const createValidation = [
    body('category_name').isString().withMessage('Category name must be a string').notEmpty(),
    body('parent_cat_id').optional().isInt().withMessage('Parent category ID must be an integer'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive')
]


const updateValidation = [
    param('id').isInt().withMessage('Category ID must be an integer'),
    body('category_name').optional().isString().withMessage('Category name must be a string'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive')
]

// routes

router.post('/', verifyToken, createValidation, createCategory);  // create
router.get('/', verifyToken, getCategories); // get all
router.get(
    '/:id',
    verifyToken,
    param('id').isInt().withMessage('Category ID must be an integer'),
    getCategoryById
); // get one by id
router.put('/:id', updateValidation, updateCategory);
// admin router
router.delete(
    '/:id',
    isAdmin,
    param('id').isInt().withMessage('Category ID must be an integer'),
    deleteCategory
);

export default router;
