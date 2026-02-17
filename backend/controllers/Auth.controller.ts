import { Request, Response, NextFunction } from 'express';
import pool from '../config/db'; 
import { handleError } from "../utility/handleError";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const Register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        
        const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (checkUser.rows.length > 0) {
            return next(handleError(409, 'User already registered.'));
        }

        
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        res.status(200).json({
            success: true,
            message: 'Registration successful.'
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const Login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return next(handleError(404, 'Invalid login credentials.'));
        }

        
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return next(handleError(404, 'Invalid login credentials.'));
        }

        
        const token = jwt.sign({
            id: user.id, 
            role: user.role,
            email: user.email
        }, process.env.JWT_SECRET as string);

        
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });

        
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            user: userWithoutPassword,
            message: 'Login successful.'
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const GoogleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, avatar } = req.body;
        
        let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        let user = result.rows[0];

        if (!user) {
            const tempPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(tempPassword, 10);
            
            const insertResult = await pool.query(
                'INSERT INTO users (name, email, password, avatar) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, email, hashedPassword, avatar]
            );
            user = insertResult.rows[0];
        }

        const token = jwt.sign({
            id: user.id,
            role: user.role,
            email: user.email
        }, process.env.JWT_SECRET as string);

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });

        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json({
            success: true,
            user: userWithoutPassword,
            message: 'Login successful.'
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const Logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });

        res.status(200).json({
            success: true,
            message: 'Logout successful.'
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};