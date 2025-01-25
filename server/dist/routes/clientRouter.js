"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
/** **************************** Validation rules ******************************* */
const signupValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('fname').notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lname').notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('phone_number').isMobilePhone('any').withMessage('Invalid phone number format')
];
const loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required')
];
/** **************************** routes ******************************* */
const router = express_1.default.Router();
//  profile (CRUD) routes are write in userRouter  path : ./ 
exports.default = router;
