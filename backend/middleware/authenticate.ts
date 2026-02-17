import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '@common/types';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    console.log(">>> [AUTH START] Checking request to:", req.originalUrl);
    
    try {
        const token = req.cookies.access_token;
        const secret = process.env.JWT_SECRET;


        if (!token) {
            console.log(">>> [AUTH FAIL] No token in cookies");
            return next({ status: 401, message: 'Unauthorized: No token provided' });
        }

        if (!secret) {
            console.log(">>> [AUTH ERROR] JWT_SECRET is missing from .env");
            return next({ status: 500, message: 'Internal Server Error: Secret missing' });
        }

        // Diagnostic Log 2: Attempting Verify
        const decoded = jwt.verify(token, secret) as UserPayload;
        req.user = decoded;
        next();

    } catch (error: any) {

        return next({ 
            status: 403, 
            message: `Forbidden: ${error.message}` // This will pass the REAL error to the frontend
        });
    }
};