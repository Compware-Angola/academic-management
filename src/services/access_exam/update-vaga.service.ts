import { axiosNestGa } from "@/lib/axios-nest-ga";

export type UpdateVagaPayload = {
  cursoId?: number;
  cursosOpcionais?: string;
  periodoId?: number;
  anoLetivoId?: number;
  numVagas?: number;
};

export type UpdateVagaResponse = {
  message: string;
};

export async function updateVaga(id: number, payload: UpdateVagaPayload) {
  const { data } = await axiosNestGa.patch<UpdateVagaResponse>(
    `/vagas/${id}`,
    payload,
    {
      showSuccess: true,
    }
  );

  return data;
}
