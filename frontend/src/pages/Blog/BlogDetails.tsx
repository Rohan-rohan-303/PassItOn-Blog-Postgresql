import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { RouteBlogAdd, RouteBlogEdit } from '@/utility/RouteName'
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/utility/getEnv'
import { deleteData } from '@/utility/handleDelete'
import { showToast } from '@/utility/showToast'
import Loading from '@/components/Loading'
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import moment from 'moment'
import type { ICategory } from '@common/types'

interface Author {
    id: string;
    name: string;
}

interface Blog {
    id: string;
    author: Author;
    category: ICategory;
    title: string;
    slug: string;
    featured_image: string; // Added featured_image to interface
    createdAt: string;
}

interface BlogListResponse {
    blog: Blog[];
}

const BlogDetails: React.FC = () => {
    const [refreshData, setRefreshData] = useState<boolean>(false)

    const { data: blogData, loading } = useFetch<BlogListResponse>(
        `${getEnv('VITE_API_BASE_URL')}/blog/get-all`, 
        {
            method: 'get',
            credentials: 'include'
        }, 
        [refreshData]
    )

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;

        try {
            const response = await deleteData(`${getEnv('VITE_API_BASE_URL')}/blog/delete/${id}`)
            if (response) {
                setRefreshData(prev => !prev)
                showToast('success', 'Data deleted.')
            } else {
                showToast('error', 'Data not deleted.')
            }
        } catch (err: any) {
            showToast('error', err.message || 'An error occurred during deletion.')
        }
    }

    if (loading) return <Loading />

    return (
        <div className="p-4">
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
                    <h2 className="text-xl font-bold">Manage Blogs</h2>
                    <Button asChild>
                        <Link to={RouteBlogAdd}>
                            Add Blog
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Image</TableHead> {/* Added Header */}
                                <TableHead>Author</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Dated</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blogData && blogData.blog.length > 0 ? (
                                blogData.blog.map((blog) => (
                                    <TableRow key={blog.id} className="hover:bg-muted/50">
                                        {/* Added Image Cell */}
                                        <TableCell>
                                            {blog.featured_image ? (
                                                <img 
                                                    src={blog.featured_image} 
                                                    alt={blog.title} 
                                                    className="w-12 h-12 object-cover rounded-md border bg-muted"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-[10px] text-muted-foreground">
                                                    No Img
                                                </div>
                                            )}
                                        </TableCell>

                                        <TableCell className="font-medium">{blog?.author?.name}</TableCell>
                                        <TableCell>{blog?.category?.name}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">{blog?.title}</TableCell>
                                        <TableCell className="italic text-muted-foreground text-xs">{blog?.slug}</TableCell>
                                        <TableCell>{moment(blog?.createdAt).format('DD-MM-YYYY')}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="icon"
                                                    className="hover:bg-violet-600 hover:text-white" 
                                                    asChild
                                                >
                                                    <Link to={RouteBlogEdit(blog.id)}>
                                                        <FiEdit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button 
                                                    onClick={() => handleDelete(blog.id)} 
                                                    variant="outline" 
                                                    size="icon"
                                                    className="hover:bg-red-600 hover:text-white"
                                                >
                                                    <FaRegTrashAlt className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center"> {/* Updated colSpan to 7 */}
                                        No blogs found.
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

export default BlogDetails