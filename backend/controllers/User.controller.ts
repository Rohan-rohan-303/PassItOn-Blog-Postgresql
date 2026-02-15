import { Request, Response, NextFunction } from 'express';
import  pool  from '../config/db';
import cloudinary from "../config/cloudinary";
import { handleError } from "../utility/handleError";
import * as bcryptjs from 'bcryptjs';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userid } = req.params;

        const query = 'SELECT id, name, email, avatar, bio, role, created_at FROM users WHERE id = $1';
        const result = await pool.query(query, [userid]);

        if (result.rows.length === 0) {
            return next(handleError(404, 'User not found.'));
        }

        res.status(200).json({
            success: true,
            message: 'User data found.',
            user: result.rows[0]
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = JSON.parse(req.body.data);
        const { userid } = req.params;

        const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [userid]);
        if (userCheck.rows.length === 0) {
            return next(handleError(404, 'User not found.'));
        }

        let avatar = userCheck.rows[0].avatar;
        let hashedPassword = userCheck.rows[0].password;

        if (data.password && data.password.length >= 8) {
            hashedPassword = bcryptjs.hashSync(data.password, 10);
        }

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'yt-mern-blog',
                resource_type: 'auto'
            });
            avatar = uploadResult.secure_url;
        }

        const updateQuery = `
            UPDATE users 
            SET name = $1, email = $2, bio = $3, password = $4, avatar = $5 
            WHERE id = $6 
            RETURNING id, name, email, avatar, bio, role, created_at
        `;
        const values = [data.name, data.email, data.bio, hashedPassword, avatar, userid];
        const result = await pool.query(updateQuery, values);

        res.status(200).json({
            success: true,
            message: 'Data updated.',
            user: result.rows[0]
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const query = 'SELECT id, name, email, avatar, role, created_at FROM users ORDER BY created_at DESC';
        const result = await pool.query(query);

        res.status(200).json({
            success: true,
            user: result.rows
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM users WHERE id = $1';
        await pool.query(query, [id]);

        res.status(200).json({
            success: true,
            message: 'Data deleted.'
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};