import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface TroncoComumCursoPayload {
  codigoSemestre: number;
  codigoCurso: number;
  codigoClasse: number;
}

export interface CreateTroncoComumPayload {
  anoLetivo: number;
  codigoGrade: number;
  cursos: TroncoComumCursoPayload[];
}

export interface CreateTroncoComumResponse {
  message: string;
  [key: string]: any;
}

export const createTroncoComumService = async (
  payload: CreateTroncoComumPayload,
): Promise<CreateTroncoComumResponse> => {
  const { data } = await axiosNestGa.post<CreateTroncoComumResponse>(
    "/discipline/tronco-comum",
    payload,
  );

  return data;
};
