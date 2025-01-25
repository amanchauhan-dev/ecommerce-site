import express from 'express';
import { body } from 'express-validator';
import { GetNewProducts } from '../controllers/publicController';
import { login, signup } from '../controllers/userController';



/** **************************** Validation rules ******************************* */
const signupValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fname').notEmpty().withMessage('First name is required'),
    body('lname').notEmpty().withMessage('Last name is required'),
    body('phone_number').isMobilePhone('any').withMessage('Invalid phone number format')
];
const loginValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
];





/** **************************** routes ******************************* */
const router = express.Router();


router.get('/newly-added', GetNewProducts) // new products
router.put('/sign-up', signupValidation, signup);  // sign up
router.post('/login', loginValidation, login);    // login













export default router;