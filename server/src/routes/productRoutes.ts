import express from 'express';
import {
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getProducts,
} from '../controllers/productController';
import { body } from 'express-validator';
import { uploadProductsImageMiddleware } from '../middleware/uploadFiles';
import { isEmployee } from '../middleware/middleware';

const router = express.Router();


export const productValidationRules = [
    body('product_name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Product name is required'),
    body('price').isDecimal().withMessage('Price must be a valid decimal number'),
    body('category_id').isNumeric().optional().withMessage('category_id must be a valid number'),
    body('stock_quantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
    body('status').isIn(['active', 'inactive']).optional().withMessage('Status must be either active or inactive'),
    body('variants').custom((value) => {
        try {
            const variants = JSON.parse(value);
            if (!Array.isArray(variants)) {
                throw new Error('Variants should be an array');
            }
            variants.forEach(variant => {
                if (typeof variant.color !== 'string' || variant.color === '') {
                    throw new Error('Each variant must have a valid color or empty');
                }
                if (variant.size && typeof variant.size !== 'string') {
                    throw new Error('Size should be a valid string or empty');
                }
                if (!Number.isInteger(variant.stock_quantity) || variant.stock_quantity < 0) {
                    throw new Error('Variant stock_quantity should be a valid integer greater than or equal to 0');
                }
                if (typeof variant.price !== 'number' || variant.price < 0) {
                    throw new Error('Variant price must be a valid number greater than or equal to 0');
                }
            });
            return true;
        } catch (error) {
            throw new Error('Variants should be a valid JSON array');
        }
    }).optional()
];

export const productUpdateValidationRules = [
    body('product_name').optional(),
    body('description').optional(),
    body('price').isDecimal().optional().withMessage('Price must be a valid decimal number'),
    body('category_id').isNumeric().optional().withMessage('category_id must be a valid number'),
    body('stock_quantity').isInt({ min: 0 }).optional().withMessage('Stock quantity must be a non-negative integer'),
    body('status').isIn(['active', 'inactive']).optional().withMessage('Status must be either active or inactive'),
    body('variants').optional().custom((value) => {
        try {
            const variants = JSON.parse(value);
            if (!Array.isArray(variants)) {
                throw new Error('Variants should be an array');
            }
            variants.forEach(variant => {
                if (variant.id)
                    if (!Number.isInteger(variant.id) || variant.id < 0) {
                        throw new Error('Each variant must have a valid color or empty');
                    }
                if (typeof variant.color !== 'string' || variant.color === '') {
                    throw new Error('Each variant must have a valid color or empty');
                }
                if (variant.size && typeof variant.size !== 'string') {
                    throw new Error('Size should be a valid string or empty');
                }
                if (!Number.isInteger(variant.stock_quantity) || variant.stock_quantity < 0) {
                    throw new Error('Variant stock should be a valid integer greater than or equal to 0');
                }
                if (typeof Number(variant.price) !== 'number' || variant.price < 0) {
                    throw new Error('Variant price must be a valid number greater than or equal to 0');
                }
            });
            return true;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }).optional()
];

// router.post('/',isEmployee, singleImageUploadMiddleware, multipleImageUploadMiddleware, createProduct);
router.post('/', isEmployee, uploadProductsImageMiddleware, productValidationRules, createProduct);
router.get('/', isEmployee, getProducts);
router.get('/:id', getProductById);
router.put('/:id', uploadProductsImageMiddleware, productUpdateValidationRules, updateProduct);
router.delete('/:id', deleteProduct);

export default router;  