"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const publicController_1 = require("../controllers/publicController");
const userController_1 = require("../controllers/userController");
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
router.get('/newly-added', publicController_1.GetNewProducts); // new products
router.put('/sign-up', signupValidation, userController_1.signup); // sign up
router.post('/login', loginValidation, userController_1.login); // login
exports.default = router;
