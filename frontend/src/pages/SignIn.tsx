import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from '@/components/ui/card';
import { RouteIndex, RouteSignUp } from '@/utility/RouteName';
import { Link, useNavigate } from 'react-router-dom';
import { getEnv } from '@/utility/getEnv'; 
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/user/user.slice';
import PassItOn from '@/assets/images/PassItOn.png';

const formSchema = z.object({
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(1, 'Password is required.')
});

type SignInValues = z.infer<typeof formSchema>;

const SignIn: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<SignInValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: SignInValues) {
        setLoading(true);
        try {
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify(values)
            });

            const data = await response.json();

            if (!response.ok) {
                return console.log('error', data.message || 'Login failed.');
            }

            dispatch(setUser(data.user));
            
            console.log('success', data.message);
            navigate(RouteIndex);
        } catch (error: any) {
            console.log('error', error.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex justify-center items-center h-screen w-screen'>
            <Card className="w-[400px] p-5 shadow-lg">
                <div className='flex justify-center items-center mb-2'>
                    <Link to={RouteIndex}>
                        <img src={PassItOn} alt="Logo" className="h-12 w-auto" />
                    </Link>
                </div>
                <h1 className='text-2xl font-bold text-center mb-5'>Login Into Account</h1>
                
                <div className='mb-6'>
                    
                    <div className='relative my-6'>
                        <div className='absolute inset-0 flex items-center'>
                            <span className='w-full border-t' />
                        </div>
                        <div className='relative flex justify-center text-xs uppercase'>
                            <span className='bg-white px-2 text-muted-foreground'>Or continue with</span>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@email.com" {...field} />
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='pt-2'>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                            <div className='mt-5 text-sm flex justify-center items-center gap-2'>
                                <p className="text-muted-foreground">Don't have an account?</p>
                                <Link className='text-primary font-semibold hover:underline' to={RouteSignUp}>
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
}

export default SignIn;