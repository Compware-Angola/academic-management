import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "./loader";

export function PublicRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Loader />;
  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
