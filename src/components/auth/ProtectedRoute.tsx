// components/auth/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/mutations/use-mutation-login";

type ProtectedRouteProps = {
  allowedGroups: string[]; 
  children: React.ReactNode;
};

export function ProtectedRoute({
  allowedGroups,
  children,
}: ProtectedRouteProps) {
     const { data: user, isError } = useCurrentUser('GA');
      if (isError) {
        return [];
      }
    
 

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const userGroups = user?.groups?.map((g) => g.sigla) || [];
  const hasAccess = allowedGroups.some((group) =>
    userGroups.includes(group)
  );

  if (!hasAccess) {
    return <Navigate to="/sem-permissao" replace />;


  }

  return <>{children}</>;
}
