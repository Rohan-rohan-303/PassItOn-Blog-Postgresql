import BlogCard from '@/components/BlogCard'
import Loading from '@/components/Loading'
import { getEnv } from '@/utility/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'

// 1. Define the shape of a single blog post
// (Ideally, move this to a types/blog.ts file later)
interface Blog {
    _id: string;
    title: string;
    slug: string;
    featuredImage: string;
    createdAt: string;
    category: {
        slug: string;
        name: string;
    };
    author: {
        name: string;
        role: 'admin' | 'user';
        avatar?: string;
    };
}

// 2. Define the expected API response
interface BlogResponse {
    blog: Blog[];
}

const Index: React.FC = () => {
    // 3. Pass the BlogResponse generic to your useFetch hook
    const { data: blogData, loading } = useFetch<BlogResponse>(
        `${getEnv('VITE_API_BASE_URL')}/blog/blogs`, 
        {
            method: 'get',
            credentials: 'include'
        }
    )

    if (loading) return <Loading />

    return (
        <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10'>
            {blogData && blogData.blog.length > 0 ? (
                // 4. blogData.blog is now typed as an array of Blog objects
                blogData.blog.map((blog) => (
                    <BlogCard key={blog._id} props={blog} />
                ))
            ) : (
                <div className="col-span-full text-center py-20 text-gray-500">
                    <p className="text-xl font-semibold">No blogs found.</p>
                    <p>Check back later for new content!</p>
                </div>
            )}
        </div>
    )
}

export default Index