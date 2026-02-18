import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getEnv } from '@/utility/getEnv'
import { showToast } from '@/utility/showToast'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Textarea } from "@/components/ui/textarea"
import { useFetch } from '@/hooks/useFetch'
import Loading from '@/components/Loading'
import { IoCameraOutline } from "react-icons/io5";
import Dropzone from 'react-dropzone'
import { setUser } from '@/redux/user/user.slice'

// 1. Define Interfaces
interface UserProfile {
    id: string;
    name: string;
    email: string;
    bio: string;
    avatar?: string;
}

interface UserResponse {
    success: boolean;
    user: UserProfile;
}

interface RootState {
    user: {
        user: UserProfile;
    };
}

// 2. Form Schema and Type Inference
const formSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long.'),
    email: z.string().email('Please enter a valid email address.'),
    bio: z.string().min(3, 'Bio must be at least 3 characters long.'),
    password: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof formSchema>

const Profile: React.FC = () => {
    const [filePreview, setPreview] = useState<string | undefined>()
    const [file, setFile] = useState<File | undefined>()
    const user = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()

    const { data: userData, loading } = useFetch<UserResponse>(
        `${getEnv('VITE_API_BASE_URL')}/user/get-user/${user.user.id}`,
        { method: 'get', credentials: 'include' }
    )

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            bio: '',
            password: '',
        },
    })

    // Populate form when data arrives
    useEffect(() => {
        if (userData?.success) {
            form.reset({
                name: userData.user.name,
                email: userData.user.email,
                bio: userData.user.bio,
                password: '', // Keep password empty by default
            })
        }
    }, [userData, form])

    async function onSubmit(values: ProfileFormValues) {
        try {
            const formData = new FormData()
            if (file) formData.append('file', file)
            
            // Logic: Only send password if it's not an empty string
            const submissionData = { ...values };
            if (!submissionData.password) delete submissionData.password;

            formData.append('data', JSON.stringify(submissionData))

            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/user/update-user/${userData?.user.id}`, {
                method: 'put',
                credentials: 'include',
                body: formData
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                return showToast('error', data.message)
            }
            
            dispatch(setUser(data.user))
            showToast('success', data.message)
        } catch (error: any) {
            showToast('error', error.message || 'Something went wrong')
        }
    }

    const handleFileSelection = (files: File[]) => {
        const selectedFile = files[0]
        if (selectedFile) {
            const preview = URL.createObjectURL(selectedFile)
            setFile(selectedFile)
            setPreview(preview)
        }
    }

    if (loading) return <Loading />

    return (
        <Card className="max-w-screen-md mx-auto my-10">
            <CardContent>
                <div className='flex flex-col justify-center items-center mt-10 gap-4'>
                    <Dropzone onDrop={handleFileSelection} multiple={false} accept={{ 'image/*': [] }}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()} className="cursor-pointer">
                                <input {...getInputProps()} />
                                <Avatar className="w-28 h-28 relative group border-2 border-muted">
                                    <AvatarImage 
                                        src={filePreview || userData?.user?.avatar} 
                                        className="object-cover" 
                                    />
                                    <div className='absolute inset-0 z-10 flex justify-center items-center bg-black/40 group-hover:opacity-100 opacity-0 transition-opacity rounded-full'>
                                        <IoCameraOutline size={30} color='white' />
                                    </div>
                                </Avatar>
                            </div>
                        )}
                    </Dropzone>
                    <p className="text-sm text-muted-foreground">Click the avatar to change your photo</p>
                </div>

                <div className="mt-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Tell us about yourself" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password (leave blank to keep current)</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">Save Changes</Button>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>
    )
}

export default Profile