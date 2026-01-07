// components/auth/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { AuthStorage } from "@/util/auth-storage";

type ProtectedRouteProps = {
  allowedGroups: string[]; 
  children: React.ReactNode;
};

export function ProtectedRoute({
  allowedGroups,
  children,
}: ProtectedRouteProps) {
  const user = AuthStorage.getUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const userGroups = user.groups?.map((g) => g.sigla) || [];

  const hasAccess = allowedGroups.some((group) =>
    userGroups.includes(group)
  );

  if (!hasAccess) {
    return <Navigate to="/sem-permissao" replace />;


  }

  return <>{children}</>;
}
