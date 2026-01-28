import { Navigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/mutations/use-mutation-login";
import { can } from "@/auth/can";

type ProtectedRouteProps = {
  allowedPermissions: string[]; 
  children: React.ReactNode;
};

export function ProtectedRoute({
  allowedPermissions,
  children,
}: ProtectedRouteProps) {
  const { data: user, isError } = useCurrentUser("GA");

  if (isError || !user) {
    return <Navigate to="/sem-permissao" replace />;
  }

  const userPermissions = user?.permissions || [];

  // verifica se alguma permissão do allowedPermissions está no userPermissions
  const hasAccess = allowedPermissions.some((permission) =>
    can(userPermissions, permission)
  );

  if (!hasAccess) {
    return <Navigate to="/sem-permissao" replace />;
  }

  return <>{children}</>;
}
