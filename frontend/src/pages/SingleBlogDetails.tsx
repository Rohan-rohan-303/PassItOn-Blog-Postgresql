import Comment from '@/components/Comment'
import CommentCount from '@/components/CommentCount'
import Loading from '@/components/Loading'
import RelatedBlog from '@/components/RelatedBlog'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { getEnv } from '@/utility/getEnv'
import { useFetch } from '@/hooks/useFetch'
import { decode } from 'entities'
import moment from 'moment'
import React from 'react'
import { useParams } from 'react-router-dom'

// 1. Define the interfaces for the Blog and Author
interface Author {
    name: string;
    avatar?: string;
}

interface BlogDetails {
    _id: string;
    title: string;
    author: Author;
    createdAt: string;
    featuredImage: string;
    blogContent: string;
}

interface BlogResponse {
    blog: BlogDetails;
}

// 2. Define the expected URL parameters
type BlogParams = {
    blog: string;
    category: string;
}

const SingleBlogDetails: React.FC = () => {
    // 3. Type the params. useParams returns partials, so we use type casting
    const { blog, category } = useParams<BlogParams>()

    const { data, loading } = useFetch<BlogResponse>(
        `${getEnv('VITE_API_BASE_URL')}/blog/get-blog/${blog}`, 
        {
            method: 'get',
            credentials: 'include',
        }, 
        [blog, category]
    )

    if (loading) return <Loading />

    // Handle case where blog might be missing (invalid ID in URL)
    if (!data?.blog) return <div className="text-center py-20 text-gray-500">Blog post not found.</div>

    const { blog: blogData } = data

    return (
        <div className='md:flex-nowrap flex-wrap flex justify-between gap-10 lg:gap-20'>
            <div className='border rounded md:w-[70%] w-full p-5 bg-white shadow-sm'>
                <h1 className='text-3xl font-bold mb-5 leading-tight'>{blogData.title}</h1>
                
                <div className='flex justify-between items-center border-b pb-5'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={blogData.author.avatar} alt={blogData.author.name} />
                        </Avatar>
                        <div>
                            <p className='font-bold text-gray-800'>{blogData.author.name}</p>
                            <p className='text-sm text-muted-foreground'>
                                {moment(blogData.createdAt).format('MMMM DD, YYYY')}
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center gap-6'>
                        <CommentCount props={{ blogid: blogData._id }} />
                    </div>
                </div>

                <div className='my-8'>
                    <img 
                        src={blogData.featuredImage} 
                        className='rounded-lg w-full object-cover max-h-[500px]' 
                        alt={blogData.title} 
                    />
                </div>

                {/* Content Section */}
                <div 
                    className='prose prose-violet max-w-none dark:prose-invert'
                    dangerouslySetInnerHTML={{ __html: decode(blogData.blogContent) || '' }} 
                />

                <div className='border-t mt-10 pt-8'>
                    <Comment props={{ blogid: blogData._id }} />
                </div>
            </div>

            {/* Sidebar: Related Blogs */}
            <div className='md:w-[30%] w-full'>
                <div className='sticky top-20 border rounded p-5 bg-gray-50/50'>
                    <RelatedBlog props={{ 
                        category: category || '', 
                        currentBlog: blog || '' 
                    }} />
                </div>
            </div>
        </div>
    )
}

export default SingleBlogDetails