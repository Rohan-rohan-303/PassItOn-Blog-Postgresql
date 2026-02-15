import { getEnv } from '@/utility/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import usericon from '@/assets/images/user.png'
import moment from 'moment'
import { useSelector } from 'react-redux'

// --- Interfaces ---

interface Author {
    name: string;
    avatar?: string;
    _id?: string;
}

interface CommentType {
    _id: string;
    comment: string;
    user: Author;
    createdAt: string;
}

interface CommentListResponse {
    comments: CommentType[];
}

interface CommentListProps {
    props: {
        blogid: string;
        newComment?: CommentType | null;
    };
}

interface RootState {
    user: {
        isLoggedIn: boolean;
        user: Author | null;
    };
}

const CommentList: React.FC<CommentListProps> = ({ props }) => {
    const user = useSelector((state: RootState) => state.user)
    
    const { data, loading } = useFetch<CommentListResponse>(
        `${getEnv('VITE_API_BASE_URL')}/comment/get/${props.blogid}`, 
        {
            method: 'get',
            credentials: 'include',
        }
    )

    if (loading) return <div className="py-4 text-center">Loading comments...</div>

    const commentsCount = (data?.comments?.length || 0) + (props.newComment ? 1 : 0);

    return (
        <div>
            <h4 className='text-2xl font-bold'>
                <span className='me-2'>{commentsCount}</span>
                Comments
            </h4>
            
            <div className='mt-5'>
                {/* Render the locally added comment (Optimistic UI) */}
                {props.newComment && (
                    <div className='flex gap-2 mb-3 animate-in fade-in slide-in-from-top-1'>
                        <Avatar>
                            <AvatarImage src={user?.user?.avatar || usericon} />
                        </Avatar>

                        <div>
                            <p className='font-bold text-violet-600'>{user?.user?.name} (Just now)</p>
                            <p className='text-sm text-gray-500'>
                                {moment(props.newComment.createdAt).format('DD-MM-YYYY')}
                            </p>
                            <div className='pt-3 text-gray-800'>
                                {props.newComment.comment}
                            </div>
                        </div>
                    </div>
                )}

                {/* Render the list from the database */}
                {data?.comments && data.comments.length > 0 ? (
                    data.comments.map((comment) => (
                        <div key={comment._id} className='flex gap-2 mb-3 border-t pt-3 first:border-none'>
                            <Avatar>
                                <AvatarImage src={comment.user?.avatar || usericon} />
                            </Avatar>

                            <div>
                                <p className='font-bold'>{comment.user?.name}</p>
                                <p className='text-sm text-gray-500'>
                                    {moment(comment.createdAt).format('DD-MM-YYYY')}
                                </p>
                                <div className='pt-3 text-gray-800'>
                                    {comment.comment}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    !props.newComment && <p className="text-gray-500 italic">No comments yet.</p>
                )}
            </div>
        </div>
    )
}

export default CommentList