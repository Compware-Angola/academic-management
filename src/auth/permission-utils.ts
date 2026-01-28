import { PermissionType, PermissionTypeDetails } from '../constants/permission.type';

export function permissionSigla(permission: PermissionType): string {
  return PermissionTypeDetails[permission]?.sigla;
}
