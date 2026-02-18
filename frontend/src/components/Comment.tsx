import React, { useState } from 'react'
import { FaComments } from "react-icons/fa";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { showToast } from '@/utility/showToast.tsx';
import { getEnv } from '@/utility/getEnv';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useSelector } from 'react-redux';
import { RouteSignIn } from '@/utility/RouteName';
import CommentList from './CommentList.tsx';
import { Link } from 'react-router-dom';
import type { IRootState } from '@common/types.ts';


const formSchema = z.object({
    comment: z.string().min(3, 'Comment must be at least 3 characters long.'),
})

type CommentFormValues = z.infer<typeof formSchema>

interface CommentProps {
    props: {
        blogid: string;
    }
}


const Comment: React.FC<CommentProps> = ({ props }) => {
    const [newComment, setNewComment] = useState<any>() 
    
    const user = useSelector((state: IRootState) => state.user)

    const form = useForm<CommentFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: '',
        },
    })

    async function onSubmit(values: CommentFormValues) {
        try {
            if (!user.user?.id) {
                return showToast('error', 'You must be logged in to comment.');
            }

            const payload = {  
                content: values.comment,
                blogid: props.blogid, 
                user: user.user.id 
            }

            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/comment/add`, {
                method: 'post',
                credentials: 'include',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (!response.ok) {
                return showToast('error', data.message)
            }

            setNewComment(data.comment)
            form.reset()
            showToast('success', data.message)
        } catch (error: any) {
            showToast('error', error.message || 'Something went wrong')
        }
    }

    return (
        <div>
            <h4 className='flex items-center gap-2 text-2xl font-bold'> 
                <FaComments className='text-violet-500' /> Comment
            </h4>

            {user && user.isLoggedIn ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='mb-3'>
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Comment</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Type your comment..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            ) : (
                <div className="py-4">
                    <Button asChild variant="outline">
                        <Link to={RouteSignIn}>Sign In to Comment</Link>
                    </Button>
                </div>
            )}

            <div className='mt-5'>
                <CommentList props={{ blogid: props.blogid, newComment }} />
            </div>
        </div>
    )
}

export default Comment