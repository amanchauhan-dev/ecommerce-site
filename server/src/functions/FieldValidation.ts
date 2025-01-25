import { Request, Response } from "express";
import { validationResult } from "express-validator";
import fs from 'fs'
import path from "path";
// Helper function for validation errors
const FieldValidation = (req: Request, res: Response): boolean => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // caught error
        res.status(400).json({ errors: errors.array() });
        // remove all the files any have been uploaded
        if (req.files) {
            const files = req.files as {
                [fieldname: string]: Express.Multer.File[] | undefined;
            };
            const filenames = Object.values(files)
                .flatMap(fileArray => fileArray && fileArray.map(file => file.filename));
            if (filenames && filenames.length > 0) {
                filenames.forEach(file => {
                    const filePath = path.join(__dirname, '../../public', 'uploads', file as any)
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        }
                    });
                })
            }
        } else {
            if (req.file) {
                const filePath = path.join(__dirname, '../../public', 'uploads', req.file.filename)
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    }
                });
            }
        }
        return false;
    }
    // validated
    return true;
};

export default FieldValidation