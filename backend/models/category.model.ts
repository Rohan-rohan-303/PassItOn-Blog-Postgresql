// models/category.model.ts
import pool from "../config/db";
import { ICategory } from "@common/types";

export const CategorySQL = {
    create: async (name: string, slug: string): Promise<ICategory> => {
        const sql = `
            INSERT INTO categories (name, slug)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const res = await pool.query(sql, [name, slug]);
        return res.rows[0];
    },

    getAll: async (): Promise<ICategory[]> => {
        const res = await pool.query(
            "SELECT * FROM categories ORDER BY name ASC;"
        );
        return res.rows;
    },

    findById: async (id: string | number): Promise<ICategory | null> => {
        const res = await pool.query(
            "SELECT * FROM categories WHERE id = $1;",
            [id]
        );
        return res.rows[0] || null;
    },

    update: async (
        id: string | number,
        name: string,
        slug: string
    ): Promise<ICategory> => {
        const res = await pool.query(
            `UPDATE categories
             SET name = $1, slug = $2
             WHERE id = $3
             RETURNING *;`,
            [name, slug, id]
        );
        return res.rows[0];
    },

    delete: async (id: string | number): Promise<void> => {
        await pool.query(
            "DELETE FROM categories WHERE id = $1;",
            [id]
        );
    },
};
