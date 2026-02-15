import { RouteSignIn } from '@/utility/RouteName'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import type { IRootState } from '@common/types'



const AuthRouteProtection = () => {
    const user = useSelector((state: IRootState) => state.user);

    if (user && user.isLoggedIn) {
        return <Outlet />;
    } else {
        return <Navigate to={RouteSignIn} replace />;
    }
}

export default AuthRouteProtection;