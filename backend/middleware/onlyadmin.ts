import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '@common/types';

export const onlyAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.access_token;

        if (!token) {
            return next({ status: 401, message: 'Unauthorized: Access token missing' });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as UserPayload;

        if (decoded.role !== 'admin') {
            return next({ status: 403, message: 'Forbidden: Admin privileges required' });
        }

        req.user = decoded;
        next();
    } catch (error: any) {
        next({ status: 403, message: 'Forbidden: Token verification failed' });
    }
};