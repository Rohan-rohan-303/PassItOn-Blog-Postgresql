import React from 'react'
import { Card, CardContent } from './ui/card'
import { Badge } from "@/components/ui/badge"
import { Avatar } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { FaRegCalendarAlt } from "react-icons/fa";
import usericon from '@/assets/images/user.png'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { RouteBlogDetails } from '@/utility/RouteName'
import type { IBlogProps } from '@common/types'


const BlogCard: React.FC<IBlogProps> = ({ props }) => {
    return (
        <Link to={RouteBlogDetails(props.category.slug, props.slug)}>
            <Card className="pt-5 transition-shadow hover:shadow-md">
                <CardContent>
                    {/* Header: Author Info */}
                    <div className='flex items-center justify-between'>
                        <div className='flex justify-between items-center gap-2'>
                            <Avatar>
                                <AvatarImage src={props.author.avatar || usericon} alt={props.author.name} />
                            </Avatar>
                            <span className="font-medium">{props.author.name}</span>
                        </div>
                        {props.author.role === 'admin' && (
                            <Badge variant="outline" className="bg-violet-500 text-white border-none">
                                Admin
                            </Badge>
                        )}
                    </div>

                    {/* Featured Image */}
                    <div className='my-4'>
                        <img 
                            src={props.featured_image} 
                            className='rounded w-full h-48 object-cover' 
                            alt={props.title} 
                        />
                    </div>

                    {/* Content: Title and Date */}
                    <div>
                        <p className='flex items-center gap-2 mb-2 text-gray-500 text-sm'>
                            <FaRegCalendarAlt />
                            <span>{moment(props.createdAt).format('DD-MM-YYYY')}</span>
                        </p>
                        <h2 className='text-2xl font-bold line-clamp-2 hover:text-violet-600 transition-colors'>
                            {props.title}
                        </h2>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default BlogCard