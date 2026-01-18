import { axiosNestGa } from "@/lib/axios-nest-ga";

/* =======================
 * PARAMS - Sugestões de alunos
 * ======================= */
export type StudentSugestoesParams = {
  search?: string;   // pode ser parte do nome, BI, código de matrícula, etc.
};

/* =======================
 * TIPO DE ALUNO (resumo da sugestão)
 * ======================= */
export type StudentSugestao = {
  codigo_matricula: number;
  bi: string;
  curso: string;
  periodo: string;
  nome_completo: string;
  estado: string;
};

/* =======================
 * FETCH - Sugestões de alunos
 * ======================= */
export const fetchStudentsSugestoes = async (
  params: StudentSugestoesParams = {}
): Promise<StudentSugestao[]> => {
  const { search = "" } = params;

  // Só envia o parâmetro se tiver valor (evita ?search= na URL)
  const queryParams = search.trim() ? { search } : {};

  const response = await axiosNestGa.get<StudentSugestao[]>(
    "/students/find/sugestoes",
    {
      params: queryParams,
    }
  );

  return response.data;
};

/* =======================
 * TIPO DE ALUNO DETALHADO (ficha completa / estatística)
 * ======================= */
export type StudentDetail = {
  codigo_matricula: number;
  bi: string;
  curso: string;
  periodo: string;
  estado: string;
  nome_completo: string;
  bi_aluno: string;
  email: string;
  telefonicos: string;
  data_nascimento: string; // formato ISO: "1993-01-28T23:00:00.000Z"
};

/* =======================
 * FETCH - Detalhes/estatística do aluno
 * ======================= */
export const fetchStudentEstatisticas = async (
  codigoMatricula: number | string
): Promise<StudentDetail> => {
  // Garante que o valor seja string na URL (o axios converte automaticamente, mas fica explícito)
  const id = String(codigoMatricula).trim();

  const response = await axiosNestGa.get<StudentDetail>(
    `/students/estatistic/${id}`
  );

  return response.data;
};