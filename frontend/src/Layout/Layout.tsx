import { Outlet } from 'react-router-dom'
import AppSidebar from '../components/AppSidebar.tsx'
import Footer from '../components/Footer.tsx'
import Topbar from '../components/Topbar.tsx'
import { SidebarProvider } from '../components/ui/sidebar.tsx'

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