import BlogCard from '@/components/BlogCard'
import Loading from '@/components/Loading'
import { getEnv } from '@/utility/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { useParams } from 'react-router-dom'
import { BiCategory } from "react-icons/bi";

interface Author {
    name: string;
    role: 'admin' | 'user';
    avatar?: string;
}

interface Blog {
    _id: string;
    title: string;
    slug: string;
    featuredImage: string;
    author: Author;
    createdAt: string;
    category: {
        slug: string;
        name?: string;
    };
}

interface BlogByCategoryResponse {
    categoryData: {
        name: string;
    };
    blog: Blog[];
}

type CategoryParams = {
    category: string;
}

const BlogByCategory: React.FC = () => {
    const { category } = useParams<CategoryParams>()

    const { data: blogData, loading } = useFetch<BlogByCategoryResponse>(
        `${getEnv('VITE_API_BASE_URL')}/blog/get-blog-by-category/${category}`, 
        {
            method: 'get',
            credentials: 'include'
        }, 
        [category]
    )

    if (loading) return <Loading />

    return (
        <div className="container mx-auto px-4 py-6">
            <div className='flex items-center gap-3 text-2xl font-bold text-violet-600 border-b-2 border-violet-100 pb-4 mb-8'>
                <BiCategory className="text-3xl" />
                <h4 className="capitalize">
                    {blogData?.categoryData?.name || 'Category'}
                </h4>
            </div>

            {blogData && blogData.blog.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {blogData.blog.map(blog => (
                        <BlogCard key={blog._id} props={blog} />
                    ))}
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border-2 border-dashed'>
                    <p className='text-gray-500 text-lg italic'>No blog posts found in this category.</p>
                </div>
            )}
        </div>
    )
}

export default BlogByCategory