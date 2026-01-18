import { axiosNestFinance } from "@/lib/axios-nest-finance";

export interface AlunoMatriculaResponse {
  nome_completo: string;
  bi: string;
  curso: string;
  periodo: string;
  estado_matricula: string;
}

export async function fetchAlunoMatricula(
  enrollmentCode: number
): Promise<AlunoMatriculaResponse> {
  const { data } = await axiosNestFinance.get(`alunos/${enrollmentCode}`);

  return data;
}
