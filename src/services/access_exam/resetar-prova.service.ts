import { axiosNestGa } from "@/lib/axios-nest-ga";

export async function resetarProva(id: number | string) {
  const { data } = await axiosNestGa.patch(`/exames-de-acesso/resetar-prova/${id}`,{}, {
      showSuccess: true, 
    });
  return data;
}