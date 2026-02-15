import React, { useEffect } from 'react'
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

// 1. Define the schema outside the component
const formSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long.'),
    slug: z.string().min(3, 'Slug must be at least 3 characters long.'),
})

// 2. Infer the type from the schema
type CategoryFormValues = z.infer<typeof formSchema>

const AddCategory: React.FC = () => {

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            slug: '',
        },
    })

    // 3. Watch the 'name' field for auto-slugging
    const categoryName = form.watch('name')

    useEffect(() => {
        if (categoryName) {
            const slug = slugify(categoryName, { lower: true })
            form.setValue('slug', slug, { shouldValidate: true })
        }
    }, [categoryName, form])

    // 4. Properly typed submit handler
    async function onSubmit(values: CategoryFormValues) {
        try {
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/category/add`, {
                method: 'post',
                 credentials: "include",
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(values)
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                return showToast('error', data.message || 'Failed to add category')
            }
            
            form.reset()
            showToast('success', data.message)
        } catch (error: any) {
            showToast('error', error.message || 'An unexpected error occurred')
        }
    }

    return (
        <div className="p-4">
            <Card className="pt-6 max-w-screen-md mx-auto shadow-sm">
                <CardContent>
                    <h2 className="text-xl font-bold mb-6">Add New Category</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Technology" {...field} />
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
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="technology" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700">
                                Create Category
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddCategory