import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};
