import { axiosNestGa } from "@/lib/axios-nest-ga";

/** Estrutura de dados retornada pela API de estudante. */
export type StudentInfoItem = {
  codigoMatricula: number;
  nomeCompleto: string;
  curso: string;
  bilhete: string;
  periodo: string;
};

/**
 * Faz uma requisição GET para buscar os dados básicos de um estudante pela matrícula.
 * Endpoint: GET /registration/estudante?matricula=<matricula>
 */
export async function fetchStudentInfoService(
  matricula: number,
): Promise<StudentInfoItem> {
  const { data } = await axiosNestGa.get<StudentInfoItem>(
    "/registration/estudante",
    {
      params: { matricula },
    },
  );
  return data;
}