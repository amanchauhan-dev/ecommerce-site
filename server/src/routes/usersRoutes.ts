import express from 'express';
import { body } from 'express-validator';
import {
    signup,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    create,
    getMyProfile,
    updateMyProfile,
    verifyMyProfile,
    dashboardLogin,
    verifyMyEmail,
    checkEmailTokenAndUpdate,
    resetPassword
} from '../controllers/userController';
import { isAdmin, isEmployee, verifyToken } from '../middleware/middleware';
import { uploadUserAvatarMiddleware } from '../middleware/uploadFiles';

const router = express.Router();

// Validation rules
const signupValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fname').notEmpty().withMessage('First name is required'),
    body('lname').notEmpty().withMessage('Last name is required'),
    body('phone_number').isMobilePhone('any').withMessage('Invalid phone number format')
];

const createUserValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fname').notEmpty().withMessage('First name is required'),
    body('lname').notEmpty().withMessage('Last name is required'),
    body('phone_number').isMobilePhone('any').withMessage('Invalid phone number format'),
    body('role').optional().isIn(['customer', 'employee', 'admin']).withMessage('Invalid role'),
    body('status').isIn(['active', 'inactive']).withMessage('Invalid status')
]

const loginValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
];

const updateValidation = [
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('fname').optional().notEmpty().withMessage('First name is required'),
    body('lname').optional().notEmpty().withMessage('Last name is required'),
    body('phone_number').optional().isMobilePhone('any').withMessage('Invalid phone number format'),
    body('role').optional().isIn(['customer', 'employee', 'admin']).withMessage('Invalid role'),
    body('status').isIn(['active', 'inactive']).optional().withMessage('Invalid status')
];



// dashboard login
router.post('/dashboard-login', loginValidation, dashboardLogin);

router.post('/', isAdmin, uploadUserAvatarMiddleware, createUserValidation, create); // only for admin

router.get('/', isEmployee, getAllUsers);  // only  for admin and employee

router.get('/:id', isEmployee, getUserById);  // only  for admin and employee  

router.put('/:id', isAdmin, uploadUserAvatarMiddleware, updateValidation, updateUser); // only admin

router.delete('/:id', isAdmin, deleteUser); // only admin




const updateProfileValidation = [
    body('fname').notEmpty().withMessage('First name is required if provided'),
    body('lname').notEmpty().withMessage('Last name is required if provided'),
    body('phone_number').isMobilePhone('any').withMessage('Invalid phone number format'),
];

const verifyProfileValidation = [
    body('password').notEmpty().withMessage('Password is required')
];
const verifyEmailValidation = [
    body('email').notEmpty().withMessage('Email is required'),
    body('type').optional().isIn(['email', 'password']).withMessage('Type to verify just email (email) or request to reset password (password), default (email)'),
    body('redirectionURL').notEmpty().withMessage('redirectionURL is required'),
];
const resetPasswordValidation = [
    body('newPass').notEmpty().withMessage('New Password is required'),
    body('type').optional().isIn(['email', 'oldPass']).withMessage('Type to reset with email (email) or reset password with (oldPAss), default (oldPass)'),
    body('oldPass').optional(),
];

// for customers
router.get('/my-profile/get-details/', verifyToken, getMyProfile);
router.put('/my-profile/update-details/:id', verifyToken, uploadUserAvatarMiddleware, updateProfileValidation, updateMyProfile);
router.put('/my-profile/verify/:id', verifyToken, verifyProfileValidation, verifyMyProfile);
// change my email
router.put('/my-profile/verify-email/:id', verifyToken, verifyEmailValidation, verifyMyEmail);
router.get('/my-profile/update-email', verifyToken, checkEmailTokenAndUpdate);
router.put('/my-profile/reset-password', verifyToken,resetPasswordValidation, resetPassword);



export default router;
