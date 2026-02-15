import { Outlet } from 'react-router-dom'
import AppSidebar from '@/components/AppSidebar'
import Footer from '@/components/Footer'
import Topbar from '@/components/Topbar'
import { SidebarProvider } from '@/components/ui/sidebar'

const Layout = () => {
    return (
        <SidebarProvider>
            <Topbar />
            <AppSidebar /> 
                <main className='w-full'>
                    <div className='w-full min-h-[calc(100vh-45px)] py-28  px-10'>
                        <Outlet />
                    </div> 
                    <Footer />
                </main>
        </SidebarProvider>
    )
}

export default Layout