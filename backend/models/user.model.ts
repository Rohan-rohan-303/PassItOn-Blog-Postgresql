import { query } from '../config/db';
import { IUser } from '@common/types';

export const UserSQL = {

    findById: async (id: string | number) => {
        const sql = 'SELECT id, name, email, role, bio, avatar FROM users WHERE id = $1';
        const res = await query(sql, [id]);
        return res.rows[0];
    },

    getAll: async () => {
        const sql = 'SELECT id, name, email, role, bio, avatar, created_at FROM users ORDER BY created_at DESC';
        const res = await query(sql);
        return res.rows;
    },

    update: async (id: string | number, data: Partial<IUser>) => {
        const fields = Object.keys(data);
        const values = Object.values(data);
        
        const setClause = fields
            .map((field, index) => `${field} = $${index + 2}`)
            .join(', ');

        const sql = `
            UPDATE users 
            SET ${setClause} 
            WHERE id = $1 
            RETURNING id, name, email, role, bio, avatar;
        `;
        
        const res = await query(sql, [id, ...values]);
        return res.rows[0];
    },

    delete: async (id: string | number) => {
        const sql = 'DELETE FROM users WHERE id = $1';
        await query(sql, [id]);
    }
};