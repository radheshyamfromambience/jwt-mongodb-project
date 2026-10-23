import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <h2>Checking authentication...</h2>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;