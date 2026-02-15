import { query } from '../config/db';
import { IComment } from '@common/types';

export const CommentSQL = {
    create: async (userId: number, blogId: number, content: string): Promise<IComment> => {
        const sql = `
            INSERT INTO comments (user_id, blog_id, content)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const res = await query(sql, [userId, blogId, content]);
        return res.rows[0];
    },

    getByBlogId: async (blogId: string | number): Promise<IComment[]> => {
        const sql = `
            SELECT 
                c.*, 
                u.name as user_name, 
                u.avatar as user_avatar
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.blog_id = $1
            ORDER BY c.created_at DESC;
        `;
        const res = await query(sql, [blogId]);
        return res.rows;
    },

    delete: async (id: string | number, userId: number): Promise<void> => {
        const sql = 'DELETE FROM comments WHERE id = $1 AND user_id = $2;';
        await query(sql, [id, userId]);
    }
};