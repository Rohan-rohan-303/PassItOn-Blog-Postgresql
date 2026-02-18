import BlogCard from '@/components/BlogCard'
import { getEnv } from '@/utility/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { useSearchParams } from 'react-router-dom'

// 1. Define the Blog interface (Same as your Index page)
interface Blog {
    _id: string;
    title: string;
    slug: string;
    featured_image: string;
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

interface BlogResponse {
    blog: Blog[];
}

const SearchResult: React.FC = () => {
    const [searchParams] = useSearchParams();
    
    // 2. Handle potential null value from URL
    const q = searchParams.get('q') || '';

    // 3. Pass the Generic type to useFetch
    const { data: blogData, loading } = useFetch<BlogResponse>(
        `${getEnv('VITE_API_BASE_URL')}/blog/search?q=${encodeURIComponent(q)}`, 
        {
            method: 'get',
            credentials: 'include'
        },
        [q] // Re-fetch when the search term changes
    );

    return (
        <>
            <div className='flex items-center gap-3 text-2xl font-bold text-violet-500 border-b pb-3 mb-5'>
                <h4>Search Result For: <span className="text-black">{q}</span></h4>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Searching for blogs...</div>
            ) : (
                <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10'>
                    {blogData && blogData.blog.length > 0 ? (
                        blogData.blog.map(blog => (
                            <BlogCard key={blog._id} props={blog} />
                        ))
                    ) : (
                        <div className="col-span-full py-10 text-gray-500 italic">
                            No blogs match your search criteria.
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default SearchResult;