import { useCurrentUser } from "@/hooks/mutations/use-mutation-login";
import { can } from "./can";
import { PermissionTypeDetails } from "@/constants/permission.type";

export function usePermission() {
  const { data: user } = useCurrentUser();

  const userPermissions: string[] = user?.permissions || [];

  const hasPermission = (
    required?: string | string[],
    options?: {
      blockFullAccess?: boolean;
    }
  ) => {
    return can(userPermissions, required, options);
  };

  const haveFullAccess = () => {
    return userPermissions.includes(
      PermissionTypeDetails.FULL_ACCESS.sigla
    );
  };

  return {
    hasPermission,
    haveFullAccess,
  };
}