
import { axiosNestGa } from "@/lib/axios-nest-ga";


export async function BlockUserAccess(
  utilizadorId: number,
  acessoId: number
): Promise<void> {



  await axiosNestGa.delete(
    `/acess_management/utilizador/${utilizadorId}/acesso/${acessoId}`,
    {
    }
  );
}
