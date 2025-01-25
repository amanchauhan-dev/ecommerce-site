"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productUpdateValidationRules = exports.productValidationRules = void 0;
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const express_validator_1 = require("express-validator");
const uploadFiles_1 = require("../middleware/uploadFiles");
const middleware_1 = require("../middleware/middleware");
const router = express_1.default.Router();
exports.productValidationRules = [
    (0, express_validator_1.body)('product_name').notEmpty().withMessage('Product name is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Product name is required'),
    (0, express_validator_1.body)('price').isDecimal().withMessage('Price must be a valid decimal number'),
    (0, express_validator_1.body)('category_id').isNumeric().optional().withMessage('category_id must be a valid number'),
    (0, express_validator_1.body)('stock_quantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
    (0, express_validator_1.body)('status').isIn(['active', 'inactive']).optional().withMessage('Status must be either active or inactive'),
    (0, express_validator_1.body)('variants').custom((value) => {
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
        }
        catch (error) {
            throw new Error('Variants should be a valid JSON array');
        }
    }).optional()
];
exports.productUpdateValidationRules = [
    (0, express_validator_1.body)('product_name').optional(),
    (0, express_validator_1.body)('description').optional(),
    (0, express_validator_1.body)('price').isDecimal().optional().withMessage('Price must be a valid decimal number'),
    (0, express_validator_1.body)('category_id').isNumeric().optional().withMessage('category_id must be a valid number'),
    (0, express_validator_1.body)('stock_quantity').isInt({ min: 0 }).optional().withMessage('Stock quantity must be a non-negative integer'),
    (0, express_validator_1.body)('status').isIn(['active', 'inactive']).optional().withMessage('Status must be either active or inactive'),
    (0, express_validator_1.body)('variants').optional().custom((value) => {
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
        }
        catch (error) {
            throw new Error(error.message);
        }
    }).optional()
];
// router.post('/',isEmployee, singleImageUploadMiddleware, multipleImageUploadMiddleware, createProduct);
router.post('/', middleware_1.isEmployee, uploadFiles_1.uploadProductsImageMiddleware, exports.productValidationRules, productController_1.createProduct);
router.get('/', middleware_1.isEmployee, productController_1.getProducts);
router.get('/:id', productController_1.getProductById);
router.put('/:id', uploadFiles_1.uploadProductsImageMiddleware, exports.productUpdateValidationRules, productController_1.updateProduct);
router.delete('/:id', productController_1.deleteProduct);
exports.default = router;
