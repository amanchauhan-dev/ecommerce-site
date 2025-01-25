"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmployee = exports.isAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
// Middleware to verify token and role
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid Token or expired, please login again', err });
        }
        console.log('verify');
        console.log('decoded', decoded);
        // Attach the user role and ID to the request
        req.user = decoded;
        req.token = token;
        next();
    });
};
exports.verifyToken = verifyToken;
// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    (0, exports.verifyToken)(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        }
        else {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
    });
};
exports.isAdmin = isAdmin;
// Middleware to check if user is employee
const isEmployee = (req, res, next) => {
    (0, exports.verifyToken)(req, res, () => {
        if (req.user.role === 'employee' || req.user.role === 'admin') {
            next();
        }
        else {
            return res.status(403).json({ message: 'Access denied. Employees only.' });
        }
    });
};
exports.isEmployee = isEmployee;
