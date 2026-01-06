// services/access/grant-user-access.service.ts
import { axiosNestGa } from "@/lib/axios-nest-ga";
import { AuthStorage } from "@/util/auth-storage";

export async function grantUserAccess(
  utilizadorId: number,
  acessoId: number
): Promise<void> {
  const user = AuthStorage.getUser();

  if (!user?.user_id) {
    throw new Error("Utilizador não autenticado");
  }

  await axiosNestGa.post(
    `/acess_management/utilizador/${utilizadorId}/acesso/${acessoId}`,
    null,
    {
      headers: {
        "x-user-logado-id": user.user_id,
      },
    }
  );
}
