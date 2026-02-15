import { Request, Response, NextFunction } from 'express';
import pool  from '../config/db'; 
import { handleError } from "../utility/handleError";
import {CategorySQL} from '../models/category.model';

export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {

        console.log("🚀 addCategory route hit");

        console.log("BODY RECEIVED:", req.body);

        const { name, slug } = req.body;

        if (!name || !slug) {
            return next(handleError(400, 'Name and Slug are required.'));
        }

        const newCategory = await CategorySQL.create(name, slug);

        res.status(201).json({
            success: true,
            message: 'Category added successfully.',
            category: newCategory
        });
    } catch (error: any) {
        console.error("🔥 FULL ERROR:", error);
        next(handleError(500, error.message));
    }
};


export const showCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryid } = req.params;
        
        const query = 'SELECT * FROM categories WHERE id = $1';
        const result = await pool.query(query, [categoryid]);

        if (result.rows.length === 0) {
            return next(handleError(404, 'Data not found.'));
        }

        res.status(200).json({
            category: result.rows[0]
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, slug } = req.body;
        const { categoryid } = req.params;

        const query = 'UPDATE categories SET name = $1, slug = $2 WHERE id = $3 RETURNING *';
        const values = [name, slug, categoryid];
        
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return next(handleError(404, 'Data not found.'));
        }

        res.status(200).json({
            success: true,
            message: 'Category updated successfully.',
            category: result.rows[0]
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryid } = req.params;

        const query = 'DELETE FROM categories WHERE id = $1';
        await pool.query(query, [categoryid]);

        res.status(200).json({
            success: true,
            message: 'Category Deleted successfully.',
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = 'SELECT * FROM categories ORDER BY name ASC';
        const result = await pool.query(query);

        res.status(200).json({
            category: result.rows
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};