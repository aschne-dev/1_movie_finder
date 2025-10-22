import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthContext";

const PrivateRoutes = () => {
  // Wait until auth initialization finishes to avoid redirecting while loading
  const { user, loading } = useAuth();

  if (loading) {
    // Deferred rendering prevents flashing the login route
    return null;
  }

  // Render the nested route tree only when a user is authenticated
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
