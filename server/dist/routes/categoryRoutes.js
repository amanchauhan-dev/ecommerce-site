"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const categoryController_1 = require("../controllers/categoryController");
const middleware_1 = require("../middleware/middleware");
const router = express_1.default.Router();
// validations
const createValidation = [
    (0, express_validator_1.body)('category_name').isString().withMessage('Category name must be a string').notEmpty(),
    (0, express_validator_1.body)('parent_cat_id').optional().isInt().withMessage('Parent category ID must be an integer'),
    (0, express_validator_1.body)('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive')
];
const updateValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage('Category ID must be an integer'),
    (0, express_validator_1.body)('category_name').optional().isString().withMessage('Category name must be a string'),
    (0, express_validator_1.body)('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive')
];
// routes
router.post('/', middleware_1.verifyToken, createValidation, categoryController_1.createCategory); // create
router.get('/', middleware_1.verifyToken, categoryController_1.getCategories); // get all
router.get('/:id', middleware_1.verifyToken, (0, express_validator_1.param)('id').isInt().withMessage('Category ID must be an integer'), categoryController_1.getCategoryById); // get one by id
router.put('/:id', updateValidation, categoryController_1.updateCategory);
// admin router
router.delete('/:id', middleware_1.isAdmin, (0, express_validator_1.param)('id').isInt().withMessage('Category ID must be an integer'), categoryController_1.deleteCategory);
exports.default = router;
