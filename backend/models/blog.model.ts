import { query } from '../config/db';
import { IBlog } from '@common/types';

export const BlogSQL = {
    create: async (blog: IBlog) => {
        const sql = `
            INSERT INTO blogs (author_id, category_id, title, slug, blog_content, featured_image)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [
            blog.author_id, 
            blog.category_id, 
            blog.title, 
            blog.slug, 
            blog.blog_content, 
            blog.featured_image
        ];
        const res = await query(sql, values);
        return res.rows[0];
    },

    getAll: async () => {
        const sql = `
            SELECT 
                b.*, 
                u.name as author_name, 
                u.avatar as author_avatar,
                c.name as category_name
            FROM blogs b
            LEFT JOIN users u ON b.author_id = u.id
            LEFT JOIN categories c ON b.category_id = c.id
            ORDER BY b.created_at DESC;
        `;
        const res = await query(sql);
        return res.rows;
    },

    findBySlug: async (slug: string) => {
        const sql = `
            SELECT b.*, u.name as author_name, c.name as category_name
            FROM blogs b
            JOIN users u ON b.author_id = u.id
            JOIN categories c ON b.category_id = c.id
            WHERE b.slug = $1;
        `;
        const res = await query(sql, [slug]);
        return res.rows[0];
    },

    update: async (id: string | number, data: Partial<IBlog>) => {
        const fields = Object.keys(data);
        const values = Object.values(data);
        
        const setClause = fields
            .map((field, index) => `${field} = $${index + 2}`)
            .join(', ');

        const sql = `UPDATE blogs SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *;`;
        const res = await query(sql, [id, ...values]);
        return res.rows[0];
    },

    delete: async (id: string | number) => {
        const sql = 'DELETE FROM blogs WHERE id = $1';
        await query(sql, [id]);
    }
};