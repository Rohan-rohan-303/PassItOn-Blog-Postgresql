import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import slugify from 'slugify'
import { showToast } from '@/utility/showToast'
import { getEnv } from '@/utility/getEnv'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useFetch } from '@/hooks/useFetch'
import Dropzone from 'react-dropzone'
import Editor from '@/components/Editor'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RouteBlog } from '@/utility/RouteName'
import type { ICategoryResponse, IRootState } from '@common/types'


const formSchema = z.object({
    category: z.string().min(1, 'Please select a category.'),
    title: z.string().min(3, 'Title must be at least 3 characters long.'),
    slug: z.string().min(3, 'Slug must be at least 3 characters long.'),
    blogContent: z.string().min(3, 'Blog content must be at least 3 characters long.'),
})

type BlogFormValues = z.infer<typeof formSchema>

const AddBlog: React.FC = () => {
    const navigate = useNavigate()
    const user = useSelector((state: IRootState) => state.user)
    
    const [filePreview, setPreview] = useState<string | undefined>()
    const [file, setFile] = useState<File | undefined>()

    const { data: categoryData } = useFetch<ICategoryResponse>(
        `${getEnv('VITE_API_BASE_URL')}/category/all-category`, 
        { method: 'get', credentials: 'include' }
    )

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: '',
            title: '',
            slug: '',
            blogContent: '',
        },
    })

    // 3. Handle Rich Text Editor Changes
    // 'any' is used for editor instance as CKEditor/TinyMCE types vary by build
    const handleEditorData = (_event: any, editor: any) => {
        const data = editor.getData()
        form.setValue('blogContent', data)
    }

    const blogTitle = form.watch('title')

    useEffect(() => {
        if (blogTitle) {
            const slug = slugify(blogTitle, { lower: true, strict: true })
            form.setValue('slug', slug)
        }
    }, [blogTitle, form])

 async function onSubmit(values: BlogFormValues) {
    if (!file) {
        return showToast('error', 'Featured image is required.')
    }

    try {
        // 1. Prepare the data exactly as your Controller expects it
        const submissionData = { 
            ...values, 
            // Postgres SERIAL uses 'id' as a number. 
            // If your Redux has 'user._id' as a string, cast it to a number.
            author: Number(user.user?.id || user.user?.id) 
        }

        const formData = new FormData()
        
        // 2. 'file' must match: upload.single('file') in BlogRoute.ts
        formData.append('file', file)
        
        // 3. 'data' must match: JSON.parse(req.body.data) in Blog.controller.ts
        formData.append('data', JSON.stringify(submissionData))

        const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/blog/add`, {
            method: 'POST',
            credentials: 'include', // Sends the auth cookie to the backend
            body: formData
            // Reminder: Do NOT set 'Content-Type' header here
        })

        const data = await response.json()
        
        if (!response.ok) {
            // This pulls the error message from your backend's handleError
            return showToast('error', data.message || 'Failed to add blog')
        }

        // 4. Cleanup and UI update
        form.reset()
        setFile(undefined)
        setPreview(undefined)
        showToast('success', data.message)
        navigate(RouteBlog)
        
    } catch (error: any) {
        showToast('error', error.message || 'An unexpected error occurred.')
    }
}

    const handleFileSelection = (acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0]
        if (selectedFile) {
            const preview = URL.createObjectURL(selectedFile)
            setFile(selectedFile)
            setPreview(preview)
        }
    }

    return (
        <div className="container mx-auto max-w-4xl py-6">
            <Card className="shadow-lg">
                <CardContent className="pt-6">
                    <h1 className='text-3xl font-bold mb-6 text-gray-800'>Create New Blog</h1>
                    
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Category Field */}
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categoryData?.category.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id?.toString() || ""}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Title Field */}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Blog Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter catchy title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Slug Field */}
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="auto-generated-slug" {...field} readOnly className="bg-muted" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Featured Image Dropzone */}
                            <div className='space-y-2'>
                                <span className='text-sm font-medium'>Featured Image</span>
                                <Dropzone onDrop={handleFileSelection} multiple={false} accept={{ 'image/*': [] }}>
                                    {({ getRootProps, getInputProps }) => (
                                        <div {...getRootProps()} className="cursor-pointer group">
                                            <input {...getInputProps()} />
                                            <div className='flex flex-col justify-center items-center w-full h-48 border-2 border-dashed rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors border-muted-foreground/25'>
                                                {filePreview ? (
                                                    <img src={filePreview} alt="Preview" className="h-full w-full object-contain p-2" />
                                                ) : (
                                                    <p className="text-muted-foreground text-sm">Drag & drop or click to upload</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Dropzone>
                            </div>

                            {/* Editor Field */}
                            <FormField
                                control={form.control}
                                name="blogContent"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <div className="min-h-[400px] border rounded-md overflow-hidden">
                                                <Editor props={{ initialData: '', onChange: handleEditorData }} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full h-12 text-lg">
                                Publish Blog
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddBlog