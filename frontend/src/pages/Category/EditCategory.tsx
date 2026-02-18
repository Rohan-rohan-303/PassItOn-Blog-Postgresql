import React, { useEffect } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import slugify from 'slugify'
import { showToast } from '@/utility/showToast'
import { getEnv } from '@/utility/getEnv'
import { useParams } from 'react-router-dom'
import { useFetch } from '@/hooks/useFetch'
import Loading from '@/components/Loading'

// 1. Define the schema for validation and type inference
const formSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long.'),
    slug: z.string().min(3, 'Slug must be at least 3 characters long.'),
})

type CategoryFormValues = z.infer<typeof formSchema>

// 2. Define the expected API response structure
interface SingleCategoryResponse {
    category: {
        id: string;
        name: string;
        slug: string;
    }
}

const EditCategory: React.FC = () => {
    // 3. Type the URL parameters
    const { category_id } = useParams<{ category_id: string }>()

    const { data: categoryData, loading } = useFetch<SingleCategoryResponse>(
        `${getEnv('VITE_API_BASE_URL')}/category/show/${category_id}`, 
        {
            method: 'get',
            credentials: 'include'
        }, 
        [category_id]
    )

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            slug: '',
        },
    })

    // 4. Sync form with fetched data
    useEffect(() => {
        if (categoryData?.category) {
            form.reset({
                name: categoryData.category.name,
                slug: categoryData.category.slug,
            })
        }
    }, [categoryData, form])

    // 5. Auto-generate slug when name changes
    const categoryName = form.watch('name')
    useEffect(() => {
        // Only auto-slug if the field is actually being interacted with 
        // to avoid overwriting values immediately during the initial load
        if (form.formState.isDirty) {
            const slug = slugify(categoryName, { lower: true })
            form.setValue('slug', slug, { shouldValidate: true })
        }
    }, [categoryName, form])

    async function onSubmit(values: CategoryFormValues) {
        try {
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/category/update/${category_id}`, {
                method: 'put',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(values)
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                return showToast('error', data.message || 'Update failed')
            }
            
            showToast('success', data.message)
        } catch (error: any) {
            showToast('error', error.message || 'An unexpected error occurred')
        }
    }

    if (loading) return <Loading />

    return (
        <div className="p-4">
            <Card className="pt-6 max-w-screen-md mx-auto shadow-md border-t-4 border-t-violet-500">
                <CardContent>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Category</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Category Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter category name" {...field} />
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
                                        <FormLabel className="font-semibold">URL Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="category-slug" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button 
                                type="submit" 
                                className="w-full bg-violet-600 hover:bg-violet-700 h-11 text-white transition-all"
                                disabled={!form.formState.isDirty}
                            >
                                Update Category
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditCategory