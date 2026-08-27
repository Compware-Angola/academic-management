import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface TroncoComumCursoPayload {
  codigoSemestre: number;
  codigoCurso: number;
  codigoClasse: number;
  temOral?: boolean;
  temPratica?: boolean;
}

export interface CreateTroncoComumPayload {
  anoLetivo: number;
  codigoGrade: number;
  cursos: TroncoComumCursoPayload[];
}

// Curso processado com sucesso
export interface TroncoComumSucesso {
  codigoCurso: number;
  nomeCurso: string;
  codigoGrade: number;
  nomeDisciplina: string;
  codigoPlanoCurso: number;
}

export interface TroncoComumErro {
  codigoCurso: number;
  nomeCurso: string;
  codigoGrade: number;
  nomeDisciplina: string;
  motivo: string;
}

export interface CreateTroncoComumResponse {
  message: string;
  codigoGrade: number;
  nomeDisciplina: string;
  totalCursos: number;
  totalSucesso: number;
  totalErros: number;
  sucesso: TroncoComumSucesso[];
  erros: TroncoComumErro[];
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
