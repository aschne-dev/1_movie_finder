import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthContext";

const PrivateRoutes = () => {
  // If a user is not present, redirect them to the login screen
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
