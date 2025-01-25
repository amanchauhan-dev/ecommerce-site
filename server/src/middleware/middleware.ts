import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Middleware to verify token and role
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid Token or expired, please login again', err });
        }
        console.log('verify');
        console.log('decoded',decoded);
        // Attach the user role and ID to the request
        req.user = decoded;
        req.token = token;
        next();
    });
};

// Middleware to check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
    });
};

// Middleware to check if user is employee
export const isEmployee = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'employee' || req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied. Employees only.' });
        }
    });
};

