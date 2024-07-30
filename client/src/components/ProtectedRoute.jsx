import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useUser } from "../context/UserContext";

function ProtectedRoute() {
    const { isLoggedIn } = useUser();
    const location = useLocation();


    if(!isLoggedIn) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return (
      <Outlet />
    )
}

export default ProtectedRoute
