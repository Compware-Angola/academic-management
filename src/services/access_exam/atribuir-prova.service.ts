import { axiosNestGa } from "@/lib/axios-nest-ga";

export async function atribuirProva(id: number | string) {
  const { data } = await axiosNestGa.post(`/exames-de-acesso/atribuir-prova/${id}`, {}, {
      showSuccess: true, 
    });
  return data;
}