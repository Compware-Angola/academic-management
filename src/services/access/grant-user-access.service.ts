
import { axiosNestGa } from "@/lib/axios-nest-ga";


export async function grantUserAccess(
  utilizadorId: number,
  acessoId: number
): Promise<void> {



  await axiosNestGa.post(
    `/acess_management/utilizador/${utilizadorId}/acesso/${acessoId}`,
    {
    }
  );
}
