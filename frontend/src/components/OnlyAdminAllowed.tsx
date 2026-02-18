import { RouteSignIn } from '@/utility/RouteName.ts'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import type { IRootState } from '@common/types'


const OnlyAdminAllowed: React.FC = () => {
    const user = useSelector((state: IRootState) => state.user);

    if (user?.isLoggedIn && user.user?.role === 'admin') {
        return <Outlet />;
    } else {
 
        return <Navigate to={RouteSignIn} replace />;
    }
}

export default OnlyAdminAllowed;