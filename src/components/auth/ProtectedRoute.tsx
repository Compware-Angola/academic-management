import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

type ProtectedRouteProps = {
  allowedGroups: string[];
  children: React.ReactNode;
};

export function ProtectedRoute({
  allowedGroups,
  children,
}: ProtectedRouteProps) {
  const { user } = useAuth();

  const userGroups = user?.groups?.map((g) => g.sigla) || [];
  const hasAccess = allowedGroups.some((group) => userGroups.includes(group));

  if (!hasAccess) {
    return <Navigate to="/sem-permissao" replace />;
  }

  return <>{children}</>;
}
