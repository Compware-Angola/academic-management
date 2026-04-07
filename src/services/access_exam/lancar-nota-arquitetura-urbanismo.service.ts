import { axiosNestGa } from "@/lib/axios-nest-ga";

export type LancarNotaArquitecturaPayload = {
  notaPratica: number;
};

export async function lancarNotaArquitecturaEUrbanismo(
  id: number,
  payload: LancarNotaArquitecturaPayload
) {
  const { data } = await axiosNestGa.post(
    `/exames-de-acesso/lancar-nota-arquitectura-e-urbanismo/${id}`,
    payload,
    {
      showSuccess: true,
    }
  );

  return data;
}