"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadUserAvatarMiddleware = exports.uploadProductsImageMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Storage configuration for Multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../../public/uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    }
});
// File filter to accept only image files
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed!'), false);
    }
};
// Multer configuration for single image upload
const uploadProductsImage = (0, multer_1.default)({
    storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
}).fields([{ name: 'product_thumbnail', maxCount: 1 }, { name: 'product_image', maxCount: 5 }]); // Field name should be 'image'
// Multer configuration for single image upload
const uploadUserAvatar = (0, multer_1.default)({
    storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
}).single('avatar'); // Field name should be 'image'
// Middleware to handle single image upload
const uploadProductsImageMiddleware = (req, res, next) => {
    uploadProductsImage(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            return res.status(400).json({ message: err.message });
        }
        else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};
exports.uploadProductsImageMiddleware = uploadProductsImageMiddleware;
// Middleware to handle single image upload
const uploadUserAvatarMiddleware = (req, res, next) => {
    uploadUserAvatar(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            return res.status(400).json({ message: err.message });
        }
        else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};
exports.uploadUserAvatarMiddleware = uploadUserAvatarMiddleware;
