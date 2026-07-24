// use-permission.ts

import { useCurrentUser } from "@/hooks/mutations/use-mutation-login";
import { can } from "./can";
import { PermissionTypeDetails } from "@/constants/permission.type";


export function usePermission() {
  const { data: user } = useCurrentUser();

  const userPermissions: string[] = user?.permissions || [];

  const hasPermission = (required?: string | string[]) => {
    const hasPer = can(userPermissions, required)
    return hasPer
  };
  const haveFullAccess = () => {
    const hasPer = can(userPermissions, PermissionTypeDetails.FULL_ACCESS.sigla)
    return hasPer
  }

  return { hasPermission, haveFullAccess };
}