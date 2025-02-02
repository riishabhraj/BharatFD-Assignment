import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();

interface AuthRequest extends Request {
    user?: any;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ error: 'Please authenticate' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;

        if (req.user?.role !== 'admin') {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }

        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate as admin' });
    }
};
