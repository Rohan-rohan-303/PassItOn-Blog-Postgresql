import { Request, Response, NextFunction } from 'express';
import  pool  from '../config/db';
import { handleError } from "../utility/handleError";

export const addcomment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user, blogid, comment } = req.body;

        const query = `
            INSERT INTO comments (user_id, blog_id, comment_text) 
            VALUES ($1, $2, $3) 
            RETURNING *
        `;
        const values = [user, blogid, comment];
        
        const result = await pool.query(query, values);

        res.status(200).json({
            success: true,
            message: 'Comment submitted.',
            comment: result.rows[0]
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { blogid } = req.params;

        const query = `
            SELECT 
                c.*, 
                json_build_object('name', u.name, 'avatar', u.avatar) as user
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.blog_id = $1
            ORDER BY c.created_at DESC
        `;
        
        const result = await pool.query(query, [blogid]);

        res.status(200).json({
            comments: result.rows
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const commentCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { blogid } = req.params;
        
        const query = 'SELECT COUNT(*) FROM comments WHERE blog_id = $1';
        const result = await pool.query(query, [blogid]);

        res.status(200).json({
            commentCount: parseInt(result.rows[0].count)
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const getAllComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user!;
        let query = `
            SELECT 
                c.*, 
                json_build_object('title', b.title) as blogid,
                json_build_object('name', u.name) as user
            FROM comments c
            JOIN blogs b ON c.blog_id = b.id
            JOIN users u ON c.user_id = u.id
        `;
        
        const values: any[] = [];

        if (user.role !== 'admin') {
            query += ` WHERE c.user_id = $1`;
            values.push(user.id);
        }

        query += ` ORDER BY c.created_at DESC`;
        
        const result = await pool.query(query, values);

        res.status(200).json({
            comments: result.rows
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentid } = req.params;
        
        const query = 'DELETE FROM comments WHERE id = $1';
        await pool.query(query, [commentid]);

        res.status(200).json({
            success: true,
            message: 'Data deleted'
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};