import { getEnv } from '@/utility/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { FaRegComment } from "react-icons/fa";

// 1. Define the API response structure
interface CommentCountResponse {
    commentCount: number;
}

// 2. Define the component props
interface CommentCountProps {
    props: {
        blogid: string;
    };
}

const CommentCount: React.FC<CommentCountProps> = ({ props }) => {
    // 3. Pass the Generic type to useFetch
    const { data, loading } = useFetch<CommentCountResponse>(
        `${getEnv('VITE_API_BASE_URL')}/comment/get-count/${props.blogid}`, 
        {
            method: 'get',
            credentials: 'include',
        }
    );

    return (
        <button 
            type='button' 
            className='flex justify-between items-center gap-1 hover:text-violet-500 transition-colors'
            disabled={loading}
        >
            <FaRegComment />
            {/* 4. data is now typed, so TS knows commentCount exists */}
            <span>{data ? data.commentCount : 0}</span>
        </button>
    )
}

export default CommentCount;