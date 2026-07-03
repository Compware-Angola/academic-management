import { axiosNestGa } from "@/lib/axios-nest-ga";

export type CreateVagaPayload = {
  cursoId: number;
  cursosOpcionais?: string;
  periodoId: number;
  anoLetivoId: number;
  numVagas: number;
  tipoCandidaturaId: number;
};

export type CreateVagaResponse = {
  message: string;
};

export async function createVaga(payload: CreateVagaPayload) {
  const { data } = await axiosNestGa.post<CreateVagaResponse>(
    "/vagas",
    payload,
    {
      showSuccess: true,
    }
  );

  return data;
}
