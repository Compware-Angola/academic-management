import { PermissionTypeDetails } from "@/constants/permission.type";

export function can(
  userPermissions: string[],
  required?: string | string[],
  options?: {
    blockFullAccess?: boolean;
  }
): boolean {
  if (!required) return true;

  const hasFullAccess = userPermissions.includes(
    PermissionTypeDetails.FULL_ACCESS.sigla
  );

  // FULL_ACCESS libera tudo, exceto quando for bloqueado
  if (hasFullAccess && !options?.blockFullAccess) {
    return true;
  }

  if (Array.isArray(required)) {
    return required.some((perm) => userPermissions.includes(perm));
  }

  return userPermissions.includes(required);
}

// Exemplo:
// Usuário com FULL_ACCESS normalmente tem acesso a todas as permissões.
//
// Porém, algumas permissões sensíveis podem bloquear o FULL_ACCESS:
//
// can(
//   ["FULL_ACCESS"],
//   "APROVE_PAYMENT",
//   { blockFullAccess: true }
// );
//
// Resultado: false
//
// Para liberar, o usuário precisa ter a permissão específica:
//
// can(
//   ["FULL_ACCESS", "APROVE_PAYMENT"],
//   "APROVE_PAYMENT",
//   { blockFullAccess: true }
// );
//
// Resultado: true


// blockFullAccess: true -> ignora o FULL_ACCESS e exige a permissão específica.
// Usado para ações críticas que nem usuários com acesso total podem executar sem permissão explícita.