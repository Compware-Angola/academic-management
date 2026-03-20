import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface CreateProgramaUCPayload {
  anoLectivo: number;
  semestre: number;
  codigoCurso: number;
  docenteCode: number;
  ficheiroName: string;
  gradeCurricularCode: number;
}

export const createProgramaUC = async (
  payload: CreateProgramaUCPayload,
): Promise<void> => {
  await axiosNestGa.post(`/docentes/programa-uc`, payload);
};
