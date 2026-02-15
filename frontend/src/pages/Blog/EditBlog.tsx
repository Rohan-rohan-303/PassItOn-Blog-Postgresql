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
import { useNavigate, useParams } from 'react-router-dom'
import { RouteBlog } from '@/utility/RouteName'
import { decode } from 'entities'
import Loading from '@/components/Loading'
import type { ICategoryResponse } from '@common/types'

const formSchema = z.object({
    category: z.string().min(1, 'Please select a category'),
    title: z.string().min(3, 'Title must be at least 3 characters long.'),
    slug: z.string().min(3, 'Slug must be at least 3 characters long.'),
    blogContent: z.string().min(3, 'Blog content must be at least 3 characters long.'),
})

type BlogFormValues = z.infer<typeof formSchema>

interface SingleBlogResponse {
    blog: {
        featuredImage: string;
        category: { _id: string };
        title: string;
        slug: string;
        blogContent: string;
    }
}

const EditBlog: React.FC = () => {
    const { blogid } = useParams<{ blogid: string }>()
    const navigate = useNavigate()

    const [filePreview, setPreview] = useState<string | undefined>()
    const [file, setFile] = useState<File | null>(null)

    // Fetch Categories
    const { data: categoryData } = useFetch<ICategoryResponse>(`${getEnv('VITE_API_BASE_URL')}/category/all-category`, {
        method: 'get',
        credentials: 'include'
    })

    // Fetch Existing Blog Data
    const { data: blogData, loading: blogLoading } = useFetch<SingleBlogResponse>(`${getEnv('VITE_API_BASE_URL')}/blog/edit/${blogid}`, {
        method: 'get',
        credentials: 'include'
    }, [blogid])

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: '',
            title: '',
            slug: '',
            blogContent: '',
        },
    })

    // Populate form when data is loaded
    useEffect(() => {
        if (blogData?.blog) {
            setPreview(blogData.blog.featuredImage)
            form.reset({
                category: blogData.blog.category._id,
                title: blogData.blog.title,
                slug: blogData.blog.slug,
                blogContent: decode(blogData.blog.blogContent)
            })
        }
    }, [blogData, form])

    // Handle Editor changes
    const handleEditorData = (_event: any, editor: any) => {
        const data = editor.getData()
        form.setValue('blogContent', data)
    }

    // Auto-generate Slug from Title
    const blogTitle = form.watch('title')
    useEffect(() => {
        if (blogTitle) {
            const slug = slugify(blogTitle, { lower: true })
            form.setValue('slug', slug)
        }
    }, [blogTitle, form])

    const handleFileSelection = (files: File[]) => {
        const selectedFile = files[0]
        if (selectedFile) {
            const preview = URL.createObjectURL(selectedFile)
            setFile(selectedFile)
            setPreview(preview)
        }
    }

    async function onSubmit(values: BlogFormValues) {
        try {
            const formData = new FormData()
            if (file) {
                formData.append('file', file)
            }
            formData.append('data', JSON.stringify(values))

            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/blog/update/${blogid}`, {
                method: 'put',
                credentials: 'include',
                body: formData
            })

            const data = await response.json()
            if (!response.ok) {
                return showToast('error', data.message)
            }

            showToast('success', data.message)
            navigate(RouteBlog)
        } catch (error: any) {
            showToast('error', error.message || "Failed to update blog")
        }
    }

    if (blogLoading) return <Loading />

    return (
        <div className="container mx-auto max-w-4xl py-6">
            <Card className="pt-5 border-none shadow-md">
                <CardContent>
                    <h1 className='text-3xl font-bold mb-6 text-gray-800'>Edit Blog</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Category</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categoryData?.category.map(cat => (
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter blog title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder="slug-path" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='space-y-2'>
                                <span className='text-sm font-semibold block'>Featured Image</span>
                                <Dropzone onDrop={handleFileSelection} multiple={false}>
                                    {({ getRootProps, getInputProps }) => (
                                        <div {...getRootProps()} className='flex flex-col justify-center items-center w-full h-48 border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer overflow-hidden'>
                                            <input {...getInputProps()} />
                                            {filePreview ? (
                                                <img src={filePreview} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <p className="text-gray-400 text-sm">Drag & drop or click to upload</p>
                                            )}
                                        </div>
                                    )}
                                </Dropzone>
                            </div>

                            <FormField
                                control={form.control}
                                name="blogContent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Blog Content</FormLabel>
                                        <FormControl>
                                            {/* Key trick: only render Editor when content is loaded */}
                                            {field.value !== undefined && (
                                                <Editor props={{ initialData: field.value, onChange: handleEditorData }} />
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 h-12 text-lg">
                                Update Blog Post
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditBlog