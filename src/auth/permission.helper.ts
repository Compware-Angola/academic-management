// use-permission.ts

import { useCurrentUser } from "@/hooks/mutations/use-mutation-login";
import { can } from "./can";


export function usePermission() {
  const { data: user } = useCurrentUser("GA");

  const userPermissions: string[] = user?.permissions || [];

  const hasPermission = (required?: string | string[]) => {
    return can(userPermissions, required);
  };

  return { hasPermission };
}