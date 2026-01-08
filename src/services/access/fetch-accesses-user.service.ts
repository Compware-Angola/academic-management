import { axiosNestGa } from "@/lib/axios-nest-ga";

export type AcessosUtilizadorResponse = {
  id: number;
  designacao: string;
  sigla: string;
  moduloId: number;
  moduloNome: string;
  tipoAcessO: string;
  ativo: boolean;
  dataAtivacao: string;
};

export async function fetchAcessosUtilizador(userId: number) {
  const { data } = await axiosNestGa.get(
    `/acess_management/utilizador/${userId}`
  );

  return data;
}
