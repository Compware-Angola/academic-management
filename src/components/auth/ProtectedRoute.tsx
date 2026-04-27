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
  const { data: user, isError, isLoading } = useCurrentUser("GA");

  // 🔄 Enquanto está a carregar, não faz nada
  if (isLoading) {
    return <div>Carregando...</div>; // podes trocar por spinner
  }

  // ❌ Se deu erro ou não tem user
  if (isError || !user) {
    return <Navigate to="/sem-permissao" replace />;
  }

  const userPermissions = user?.permissions || [];

  const hasAccess = allowedPermissions.some((permission) =>
    can(userPermissions, permission)
  );

  // 🚫 Sem permissão
  if (!hasAccess) {
    return <Navigate to="/sem-permissao" replace />;
  }

  // ✅ Tudo ok
  return <>{children}</>;
}