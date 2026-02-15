import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserPayload } from '@common/types';

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.access_token;

        if (!token) {
            return next({ status: 401, message: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as UserPayload;

        req.user = decoded;
        
        next();
    } catch (error: any) {
        next({ status: 403, message: 'Forbidden: Invalid or expired token' });
    }
};