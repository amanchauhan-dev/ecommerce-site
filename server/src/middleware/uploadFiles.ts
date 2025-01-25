import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

// Storage configuration for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File filter to accept only image files
const imageFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!') as any, false);
    }
};

// Multer configuration for single image upload
const uploadProductsImage = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
}).fields([{ name: 'product_thumbnail', maxCount: 1 }, { name: 'product_image', maxCount: 5 }]); // Field name should be 'image'

// Multer configuration for single image upload
const uploadUserAvatar = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
}).single('avatar'); // Field name should be 'image'

// Middleware to handle single image upload
export const uploadProductsImageMiddleware = (req: Request, res: Response, next: NextFunction) => {
    uploadProductsImage(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};
// Middleware to handle single image upload
export const uploadUserAvatarMiddleware = (req: Request, res: Response, next: NextFunction) => {
    uploadUserAvatar(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

