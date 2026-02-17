import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/utility/getEnv'
import Loading from '@/components/Loading'
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteData } from '@/utility/handleDelete'
import { showToast } from '@/utility/showToast'

// 1. Define the Comment structure
interface CommentItem {
    id: string;
    comment: string;
    blogid: {
        id: string;
        title: string;
    };
    user: {
        id: string;
        name: string;
    };
}

interface CommentsResponse {
    comments: CommentItem[];
}

const Comments: React.FC = () => {
    // 2. refreshData acts as a toggle to re-trigger the useFetch dependency array
    const [refreshData, setRefreshData] = useState<boolean>(false)

    const { data, loading } = useFetch<CommentsResponse>(
        `${getEnv('VITE_API_BASE_URL')}/comment/get-all-comment`, 
        {
            method: 'get',
            credentials: 'include'
        }, 
        [refreshData]
    )

    const handleDelete = async (id: string): Promise<void> => {
        const success = await deleteData(`${getEnv('VITE_API_BASE_URL')}/comment/delete/${id}`)
        
        if (success) {
            setRefreshData(prev => !prev)
            showToast('success', 'Comment deleted successfully.')
        } else {
            showToast('error', 'Failed to delete comment.')
        }
    }

    if (loading) return <Loading />

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">All Comments</h2>
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30%]">Blog Title</TableHead>
                                <TableHead className="w-[20%]">Commented By</TableHead>
                                <TableHead className="w-[40%]">Comment</TableHead>
                                <TableHead className="w-[10%] text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data.comments.length > 0 ? (
                                data.comments.map((comment) => (
                                    <TableRow key={comment.id}>
                                        <TableCell className="font-medium">
                                            {comment.blogid?.title || 'Deleted Blog'}
                                        </TableCell>
                                        <TableCell>{comment.user?.name || 'Unknown User'}</TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {comment.comment}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                onClick={() => handleDelete(comment.id)} 
                                                variant="outline" 
                                                size="icon"
                                                className="hover:bg-red-500 hover:text-white transition-colors"
                                                title="Delete Comment"
                                            >
                                                <FaRegTrashAlt />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No comments found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default Comments