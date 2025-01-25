"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Helper function for validation errors
const FieldValidation = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // caught error
        res.status(400).json({ errors: errors.array() });
        // remove all the files any have been uploaded
        if (req.files) {
            const files = req.files;
            const filenames = Object.values(files)
                .flatMap(fileArray => fileArray && fileArray.map(file => file.filename));
            if (filenames && filenames.length > 0) {
                filenames.forEach(file => {
                    const filePath = path_1.default.join(__dirname, '../../public', 'uploads', file);
                    fs_1.default.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        }
                    });
                });
            }
        }
        else {
            if (req.file) {
                const filePath = path_1.default.join(__dirname, '../../public', 'uploads', req.file.filename);
                fs_1.default.unlink(filePath, (err) => {
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
exports.default = FieldValidation;
