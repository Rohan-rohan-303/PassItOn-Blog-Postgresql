import { getEnv } from '@/utility/getEnv'
import { RouteBlogDetails } from '@/utility/RouteName'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { Link } from 'react-router-dom'


interface RelatedBlogItem {
    _id: string;
    title: string;
    slug: string;
    featured_image: string;
}

interface RelatedBlogResponse {
    relatedBlog: RelatedBlogItem[];
}

interface RelatedBlogProps {
    props: {
        category: string;
        currentBlog: string; 
    };
}

const RelatedBlog: React.FC<RelatedBlogProps> = ({ props }) => {
    const { data, loading } = useFetch<RelatedBlogResponse>(
        `${getEnv('VITE_API_BASE_URL')}/blog/get-related-blog/${props.category}/${props.currentBlog}`, 
        {
            method: 'get',
            credentials: 'include',
        }
    );

    if (loading) return <div className="py-4 text-gray-500">Loading related blogs...</div>;

    return (
        <div className="mt-8">
            <h2 className='text-2xl font-bold mb-5'>Related Blogs</h2>
            <div>
                {data && data.relatedBlog.length > 0 ? (
                    data.relatedBlog.map((blog) => (
                        <Link 
                            key={blog._id} 
                            to={RouteBlogDetails(props.category, blog.slug)}
                            className="group"
                        >
                            <div className='flex items-center gap-3 mb-4 transition-transform group-hover:translate-x-1'>
                                <img 
                                    className='w-[100px] h-[70px] object-cover rounded-md shadow-sm' 
                                    src={blog.featured_image} 
                                    alt={blog.title}
                                />
                                <h4 className='line-clamp-2 text-lg font-semibold group-hover:text-violet-600 transition-colors'>
                                    {blog.title}
                                </h4>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-gray-400 italic">
                        No related blogs found.
                    </div>
                )}
            </div>
        </div>
    )
}

export default RelatedBlog;