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
import { FaRegTrashAlt } from "react-icons/fa"
import { deleteData } from '@/utility/handleDelete'
import { showToast } from '@/utility/showToast'
import usericon from '@/assets/images/user.png'
import moment from 'moment'
import { Avatar, AvatarImage } from '@/components/ui/avatar'

// 1. Define the User Interface
interface UserItem {
    _id: string;
    role: 'admin' | 'user';
    name: string;
    email: string;
    avatar?: string;
    createdAt: string;
}

interface AllUsersResponse {
    user: UserItem[];
}

const User: React.FC = () => {
    const [refreshData, setRefreshData] = useState<boolean>(false)
    
    // 2. Pass the response type to useFetch
    const { data, loading } = useFetch<AllUsersResponse>(
        `${getEnv('VITE_API_BASE_URL')}/user/get-all-user`, 
        {
            method: 'get',
            credentials: 'include'
        }, 
        [refreshData]
    )

    const handleDelete = async (id: string): Promise<void> => {
        const confirmed = await deleteData(`${getEnv('VITE_API_BASE_URL')}/user/delete/${id}`)
        if (confirmed) {
            setRefreshData(prev => !prev)
            showToast('success', 'User deleted successfully.')
        } else {
            showToast('error', 'User deletion failed or cancelled.')
        }
    }

    if (loading) return <Loading />

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Role</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Avatar</TableHead>
                                <TableHead>Joined Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data.user.length > 0 ? (
                                data.user.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                user.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Avatar className="w-9 h-9">
                                                <AvatarImage src={user.avatar || usericon} alt={user.name} />
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>{moment(user.createdAt).format('DD MMM YYYY')}</TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                onClick={() => handleDelete(user._id)} 
                                                variant="ghost" 
                                                size="icon"
                                                className="text-red-500 hover:text-white hover:bg-red-500"
                                            >
                                                <FaRegTrashAlt size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                        No users found.
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

export default User