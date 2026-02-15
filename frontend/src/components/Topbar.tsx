import React, { useState } from 'react'
import logo from '@/assets/images/PassItOn.png'
import { Button } from './ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { MdLogin } from "react-icons/md"
import SearchBox from './SearchBox'
import { RouteBlogAdd, RouteIndex, RouteProfile, RouteSignIn } from '@/utility/RouteName'
import { useDispatch, useSelector } from 'react-redux'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import usericon from '@/assets/images/user.png'

import { FaRegUser } from "react-icons/fa"
import { FaPlus } from "react-icons/fa6"
import { IoLogOutOutline } from "react-icons/io5"
import { removeUser } from '@/redux/user/user.slice'
import { showToast } from '@/utility/showToast'
import { getEnv } from '@/utility/getEnv'
import { IoMdSearch } from "react-icons/io"
import { AiOutlineMenu } from "react-icons/ai"
import { useSidebar } from './ui/sidebar'
import type { IRootState } from '@common/types'



const Topbar: React.FC = () => {
    const { toggleSidebar } = useSidebar()
    const [showSearch, setShowSearch] = useState<boolean>(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    // Type the Redux selector
    const user = useSelector((state: IRootState) => state.user)

    const handleLogout = async (): Promise<void> => {
        try {
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/logout`, {
                method: 'get',
                credentials: 'include',
            })
            const data = await response.json()
            
            if (!response.ok) {
                return showToast('error', data.message)
            }
            
            dispatch(removeUser())
            navigate(RouteIndex)
            showToast('success', data.message)
        } catch (error: any) {
            showToast('error', error.message || 'Logout failed')
        }
    }

    const toggleSearch = (): void => {
        setShowSearch((prev) => !prev)
    }

    return (
        <div className='flex justify-between items-center h-16 fixed w-full z-20 bg-white px-5 border-b'>
            {/* Left: Logo & Mobile Menu */}
            <div className='flex justify-center items-center gap-2'>
                <button onClick={toggleSidebar} className='md:hidden' type='button' aria-label="Toggle Sidebar">
                    <AiOutlineMenu size={20} />
                </button>
                <Link to={RouteIndex}>
                    <img src={logo} className='md:w-auto w-48 h-10' alt="Company Logo" />
                </Link>
            </div>

            {/* Middle: Search Box */}
            <div className='w-[500px]'>
                <div className={`md:relative md:block absolute bg-white left-0 w-full md:top-0 top-16 md:p-0 p-5 shadow-md md:shadow-none ${showSearch ? 'block' : 'hidden'}`}>
                    <SearchBox />
                </div>
            </div>

            {/* Right: Actions */}
            <div className='flex items-center gap-5'>
                <button onClick={toggleSearch} type='button' className='md:hidden block' aria-label="Toggle Search">
                    <IoMdSearch size={25} />
                </button>

                {!user.isLoggedIn || !user.user ? (
                    <Button asChild className="rounded-full">
                        <Link to={RouteSignIn}>
                            <MdLogin className="mr-2" />
                            Sign In
                        </Link>
                    </Button>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none">
                            <Avatar>
                                <AvatarImage src={user.user.avatar || usericon} alt={user.user.name} />
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <p className="font-bold truncate">{user.user.name}</p>
                                <p className='text-xs text-gray-500 truncate'>{user.user.email}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to={RouteProfile} className="flex items-center w-full">
                                    <FaRegUser className="mr-2" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to={RouteBlogAdd} className="flex items-center w-full">
                                    <FaPlus className="mr-2" />
                                    Create Blog
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem 
                                onClick={handleLogout} 
                                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                                <IoLogOutOutline className="mr-2" size={18} />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    )
}

export default Topbar