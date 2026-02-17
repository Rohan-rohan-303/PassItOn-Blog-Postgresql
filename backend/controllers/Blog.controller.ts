import { Request, Response, NextFunction } from 'express';
import  pool  from '../config/db'; 
import cloudinary from "../config/cloudinary";
import { handleError } from "../utility/handleError";
import { encode } from 'entities';


const blogBaseQuery = `
    SELECT 
        b.*, 
        json_build_object('name', u.name, 'avatar', u.avatar, 'role', u.role) AS author,
        json_build_object('name', c.name, 'slug', c.slug) AS category
    FROM blogs b
    LEFT JOIN users u ON b.author_id = u.id
    LEFT JOIN categories c ON b.category_id = c.id
`;

export const addBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!req.file) {
            return next({ statusCode: 400, message: "Image file is missing" });
        }

        // 2. Safely parse the data
        if (!req.body.data) {
            return next({ statusCode: 400, message: "Form data is missing" });
        }
        const data = JSON.parse(req.body.data);
        let featuredImage = '';

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'yt-mern-blog',
                resource_type: 'auto'
            });
            featuredImage = uploadResult.secure_url;
        }

        const slug = `${data.slug}-${Math.round(Math.random() * 100000)}`;
        
        const query = `
            INSERT INTO blogs (author_id, category_id, title, slug, featured_image, blog_content)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [data.author, data.category, data.title, slug, featuredImage, encode(data.blogContent)];
        
        await pool.query(query, values);

        res.status(200).json({ success: true, message: 'Blog added successfully.' });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { blogid } = req.params;
        const data = JSON.parse(req.body.data);

        
        const currentBlog = await pool.query('SELECT featured_image FROM blogs WHERE id = $1', [blogid]);
        if (currentBlog.rows.length === 0) return next(handleError(404, 'Data not found.'));

        let featuredImage = currentBlog.rows[0].featured_image;

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'yt-mern-blog',
                resource_type: 'auto'
            });
            featuredImage = uploadResult.secure_url;
        }

        const query = `
            UPDATE blogs 
            SET category_id = $1, title = $2, slug = $3, blog_content = $4, featured_image = $5
            WHERE id = $6
        `;
        const values = [data.category, data.title, data.slug, encode(data.blogContent), featuredImage, blogid];
        
        await pool.query(query, values);

        res.status(200).json({ success: true, message: 'Blog updated successfully.' });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const showAllBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user!;
        let query = blogBaseQuery;
        const values: any[] = [];

        if (user.role !== 'admin') {
            query += ` WHERE b.author_id = $1`;
            values.push(user.id);
        }

        query += ` ORDER BY b.created_at DESC`;
        const result = await pool.query(query, values);

        res.status(200).json({ blog: result.rows });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const getBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;
        const query = `${blogBaseQuery} WHERE b.slug = $1`;
        const result = await pool.query(query, [slug]);

        res.status(200).json({ blog: result.rows[0] });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { blogid } = req.params;
        await pool.query('DELETE FROM blogs WHERE id = $1', [blogid]);
        res.status(200).json({ success: true, message: 'Blog Deleted successfully.' });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const search = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { q } = req.query;
        const query = `${blogBaseQuery} WHERE b.title ILIKE $1 ORDER BY b.created_at DESC`;
        const result = await pool.query(query, [`%${q}%`]);

        res.status(200).json({ blog: result.rows });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};


export const editBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { blogid } = req.params;
        
        const query = `
            SELECT b.*, json_build_object('name', c.name) as category 
            FROM blogs b 
            LEFT JOIN categories c ON b.category_id = c.id 
            WHERE b.id = $1
        `;
        const result = await pool.query(query, [blogid]);

        if (result.rows.length === 0) {
            return next(handleError(404, 'Data not found.'));
        }

        res.status(200).json({ blog: result.rows[0] });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const getRelatedBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category, blog } = req.params;

       
        const catResult = await pool.query('SELECT id FROM categories WHERE slug = $1', [category]);
        if (catResult.rows.length === 0) {
            return next(handleError(404, 'Category data not found.'));
        }
        const categoryId = catResult.rows[0].id;

 
        const query = `SELECT * FROM blogs WHERE category_id = $1 AND slug != $2 LIMIT 5`;
        const relatedResult = await pool.query(query, [categoryId, blog]);

        res.status(200).json({ relatedBlog: relatedResult.rows });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const getBlogByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category } = req.params;

        const catResult = await pool.query('SELECT * FROM categories WHERE slug = $1', [category]);
        if (catResult.rows.length === 0) {
            return next(handleError(404, 'Category data not found.'));
        }
        const categoryData = catResult.rows[0];

        const query = `${blogBaseQuery} WHERE b.category_id = $1 ORDER BY b.created_at DESC`;
        const blogResult = await pool.query(query, [categoryData.id]);

        res.status(200).json({
            blog: blogResult.rows,
            categoryData
        });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};

export const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = `${blogBaseQuery} ORDER BY b.created_at DESC`;
        const result = await pool.query(query);

        res.status(200).json({ blog: result.rows });
    } catch (error: any) {
        next(handleError(500, error.message));
    }
};