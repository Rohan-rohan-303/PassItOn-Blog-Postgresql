import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import logo from '@/assets/images/PassItOn.png';
import { IoHomeOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { GrBlog } from "react-icons/gr";
import { FaRegComments } from "react-icons/fa6";
import { LuUsers } from "react-icons/lu";
import { GoDot } from "react-icons/go";
import { RouteBlog, RouteBlogByCategory, RouteCategoryDetails, RouteCommentDetails, RouteIndex, RouteUser } from "@/utility/RouteName";
import { useFetch } from "@/hooks/useFetch.ts";
import { getEnv } from "@/utility/getEnv";
import { useSelector } from "react-redux";
import type { ICategoryResponse, IRootState } from "@common/types";



const AppSidebar = () => {
    const user = useSelector((state: IRootState) => state.user);

    const { data: categoryData } = useFetch<ICategoryResponse>(
        `${getEnv('VITE_API_BASE_URL')}/category/all-category`, 
        {
            method: 'get',
            credentials: 'include'
        }
    );

    return (
        <Sidebar>
            <SidebarHeader className="bg-white">
                <img src={logo} width={120} alt="Logo" />
            </SidebarHeader>
            <SidebarContent className="bg-white">
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link to={RouteIndex}>
                                    <IoHomeOutline />
                                    <span>Home</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        {user?.isLoggedIn && (
                            <>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={RouteBlog}>
                                            <GrBlog />
                                            <span>Blogs</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={RouteCommentDetails}>
                                            <FaRegComments />
                                            <span>Comments</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </>
                        )}

                        {user?.isLoggedIn && user.user?.role === 'admin' && (
                            <>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={RouteCategoryDetails}>
                                            <BiCategoryAlt />
                                            <span>Categories</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={RouteUser}>
                                            <LuUsers />
                                            <span>Users</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </>
                        )}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Categories</SidebarGroupLabel>
                    <SidebarMenu>
                        {categoryData?.category && categoryData.category.length > 0 && 
                            categoryData.category.map((category) => (
                                <SidebarMenuItem key={category.id}>
                                    <SidebarMenuButton asChild>
                                        <Link to={RouteBlogByCategory(category.slug)}>
                                            <GoDot />
                                            <span>{category.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))
                        }
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

export default AppSidebar;