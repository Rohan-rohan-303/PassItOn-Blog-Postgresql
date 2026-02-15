import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RouteAddCategory, RouteEditCategory } from '@/utility/RouteName'
import { Link } from 'react-router-dom'
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
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteData } from '@/utility/handleDelete'
import { showToast } from '@/utility/showToast'

// 1. Define the Category structure
interface Category {
    _id: string;
    name: string;
    slug: string;
}

// 2. Define the API Response structure
interface CategoryResponse {
    category: Category[];
}

const CategoryDetails: React.FC = () => {
    const [refreshData, setRefreshData] = useState<boolean>(false)

    // 3. Pass the interface to useFetch for auto-completion on categoryData
    const { data: categoryData, loading } = useFetch<CategoryResponse>(
        `${getEnv('VITE_API_BASE_URL')}/category/all-category`, 
        {
            method: 'get',
            credentials: 'include'
        }, 
        [refreshData]
    )

    // 4. Properly typed delete handler
    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            const response = await deleteData(`${getEnv('VITE_API_BASE_URL')}/category/delete/${id}`)
            if (response) {
                setRefreshData(prev => !prev)
                showToast('success', 'Category deleted successfully.')
            } else {
                showToast('error', 'Failed to delete category.')
            }
        } catch (error: any) {
            showToast('error', error.message || 'An error occurred.')
        }
    }

    if (loading) return <Loading />

    return (
        <div className="p-4">
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <h2 className="text-xl font-bold">Categories</h2>
                    <Button asChild>
                        <Link to={RouteAddCategory}>
                            Add Category
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Category Name</TableHead>
                                <TableHead className="w-[40%]">Slug</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categoryData && categoryData.category.length > 0 ? (
                                categoryData.category.map((category) => (
                                    <TableRow key={category._id} className="hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>
                                            <span className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">
                                                {category.slug}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    className="hover:bg-violet-600 hover:text-white" 
                                                    asChild
                                                >
                                                    <Link to={RouteEditCategory(category._id)}>
                                                        <FiEdit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button 
                                                    onClick={() => handleDelete(category._id)} 
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
                                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                        No categories found. Start by adding one!
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

export default CategoryDetails