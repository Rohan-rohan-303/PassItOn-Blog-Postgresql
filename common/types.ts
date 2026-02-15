/// <reference types="multer" />

export interface IUser {
    id?: number;
    role: 'user' | 'admin';
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    password?: string;
}

export interface IUserState {
        isLoggedIn: boolean;
        user: {
            _id: string;
            role: 'admin' | 'user';
            name?: string;
            email?: string;
            avatar?: string;
        } | null;
}

export interface IRootState {
    user: IUserState;
}

export interface IBlog {
    id?: number;
    author_id: number;
    category_id: number;
    title: string;
    slug: string;
    blog_content: string;
    featured_image: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface IBlogProps {
    props: {
        title: string;
        slug: string;
        featuredImage: string;
        createdAt: string | Date;
        category: {
            slug: string;
            name?: string;
        };
        author: {
            name: string;
            role: 'admin' | 'user';
            avatar?: string;
        };
    };
}

export interface ICategory {
    id?: number;
    name: string;
    slug: string;
    created_at?: Date;
}

export interface ICategoryResponse {
    category: ICategory[];
}

export interface IComment {
    id?: number;
    user_id: number;
    blog_id: number;
    content: string;
    created_at?: Date;
 
    user_name?: string;
    user_avatar?: string;
}

export interface UserPayload {
    id: string;
    email: string;
    role: 'admin' | 'user';
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
            file?: Multer.File;
        }
    } }

    export {};