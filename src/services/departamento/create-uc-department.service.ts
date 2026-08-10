import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface DisciplinaDepartamentoPayload {
  codigoDepartamento: number;
  codigoClasse: number;
  disciplinas: {
    codigoDisciplina: number;
  }[];
}

export interface DisciplinaDepartamentoResponse {
  message: string;
  [key: string]: unknown;
}

export async function createDisciplinasDepartamento(
  payload: DisciplinaDepartamentoPayload,
): Promise<DisciplinaDepartamentoResponse> {
  const { data } = await axiosNestGa.post("/discipline/departamento", payload);

  return data;
}
