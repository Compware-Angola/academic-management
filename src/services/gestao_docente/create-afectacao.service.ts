import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface CreateDocenteAfectacaoPayload {
  anoLectivo: number;
  semestre: number;
  unidadeCurricular: number;
  docente: number;
  categoria: number;
}

export const createDocenteAfectacao = async (
  payload: CreateDocenteAfectacaoPayload,
): Promise<void> => {
  await axiosNestGa.post(`/docente-gestao/afectacao`, payload);
};
