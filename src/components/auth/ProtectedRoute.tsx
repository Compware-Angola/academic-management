// components/auth/ProtectedRoute.tsx
import { Navigate, useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/mutations/use-mutation-login";
import { useEffect } from "react";
import { AuthStorage } from "@/util/auth-storage";

type ProtectedRouteProps = {
  allowedGroups: string[];
  children: React.ReactNode;
};

export function ProtectedRoute({
  allowedGroups,
  children,
}: ProtectedRouteProps) {
  const { data: user, isLoading, isError } = useCurrentUser("GA");
  const navigate = useNavigate();
  useEffect(() => {
    if (isError) {
      AuthStorage.logout();
      navigate("/", { replace: true });
    }
  }, [isError, navigate]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const userGroups = user?.groups?.map((g) => g.sigla) || [];
  const hasAccess = allowedGroups.some((group) => userGroups.includes(group));

  if (!hasAccess) {
    return <Navigate to="/sem-permissao" replace />;
  }

  return <>{children}</>;
}
