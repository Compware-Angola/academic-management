export function can(
  userPermissions: string[],
  required?: string | string[]
): boolean {
  if (!required) return true;

  // FULL ACCESS bypass
  if (userPermissions.includes("full.access")) return true;

  if (Array.isArray(required)) {
    return required.some((perm) => userPermissions.includes(perm));
  }

  return userPermissions.includes(required);
}
