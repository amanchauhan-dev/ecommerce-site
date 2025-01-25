"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const userController_1 = require("../controllers/userController");
const middleware_1 = require("../middleware/middleware");
const uploadFiles_1 = require("../middleware/uploadFiles");
const router = express_1.default.Router();
// Validation rules
const signupValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('fname').notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lname').notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('phone_number').isMobilePhone('any').withMessage('Invalid phone number format')
];
const createUserValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('fname').notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lname').notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('phone_number').isMobilePhone('any').withMessage('Invalid phone number format'),
    (0, express_validator_1.body)('role').optional().isIn(['customer', 'employee', 'admin']).withMessage('Invalid role'),
    (0, express_validator_1.body)('status').isIn(['active', 'inactive']).withMessage('Invalid status')
];
const loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required')
];
const updateValidation = [
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('fname').optional().notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lname').optional().notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('phone_number').optional().isMobilePhone('any').withMessage('Invalid phone number format'),
    (0, express_validator_1.body)('role').optional().isIn(['customer', 'employee', 'admin']).withMessage('Invalid role'),
    (0, express_validator_1.body)('status').isIn(['active', 'inactive']).optional().withMessage('Invalid status')
];
// dashboard login
router.post('/dashboard-login', loginValidation, userController_1.dashboardLogin);
router.post('/', middleware_1.isAdmin, uploadFiles_1.uploadUserAvatarMiddleware, createUserValidation, userController_1.create); // only for admin
router.get('/', middleware_1.isEmployee, userController_1.getAllUsers); // only  for admin and employee
router.get('/:id', middleware_1.isEmployee, userController_1.getUserById); // only  for admin and employee  
router.put('/:id', middleware_1.isAdmin, uploadFiles_1.uploadUserAvatarMiddleware, updateValidation, userController_1.updateUser); // only admin
router.delete('/:id', middleware_1.isAdmin, userController_1.deleteUser); // only admin
const updateProfileValidation = [
    (0, express_validator_1.body)('fname').notEmpty().withMessage('First name is required if provided'),
    (0, express_validator_1.body)('lname').notEmpty().withMessage('Last name is required if provided'),
    (0, express_validator_1.body)('phone_number').isMobilePhone('any').withMessage('Invalid phone number format'),
];
const verifyProfileValidation = [
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required')
];
const verifyEmailValidation = [
    (0, express_validator_1.body)('email').notEmpty().withMessage('Email is required'),
    (0, express_validator_1.body)('type').optional().isIn(['email', 'password']).withMessage('Type to verify just email (email) or request to reset password (password), default (email)'),
    (0, express_validator_1.body)('redirectionURL').notEmpty().withMessage('redirectionURL is required'),
];
const resetPasswordValidation = [
    (0, express_validator_1.body)('newPass').notEmpty().withMessage('New Password is required'),
    (0, express_validator_1.body)('type').optional().isIn(['email', 'oldPass']).withMessage('Type to reset with email (email) or reset password with (oldPAss), default (oldPass)'),
    (0, express_validator_1.body)('oldPass').optional(),
];
// for customers
router.get('/my-profile/get-details/', middleware_1.verifyToken, userController_1.getMyProfile);
router.put('/my-profile/update-details/:id', middleware_1.verifyToken, uploadFiles_1.uploadUserAvatarMiddleware, updateProfileValidation, userController_1.updateMyProfile);
router.put('/my-profile/verify/:id', middleware_1.verifyToken, verifyProfileValidation, userController_1.verifyMyProfile);
// change my email
router.put('/my-profile/verify-email/:id', middleware_1.verifyToken, verifyEmailValidation, userController_1.verifyMyEmail);
router.get('/my-profile/update-email', middleware_1.verifyToken, userController_1.checkEmailTokenAndUpdate);
router.put('/my-profile/reset-password', middleware_1.verifyToken, resetPasswordValidation, userController_1.resetPassword);
exports.default = router;
