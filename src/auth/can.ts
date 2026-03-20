import { PermissionTypeDetails } from "@/constants/permission.type";

export function can(
  userPermissions: string[],
  required?: string | string[]
): boolean {
  if (!required) return true;


  if (userPermissions.includes(PermissionTypeDetails.FULL_ACCESS.sigla)) return true;

  if (Array.isArray(required)) {
    return required.some((perm) => userPermissions.includes(perm));
  }

  return userPermissions.includes(required);
}
