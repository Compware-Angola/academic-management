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
    { params: queryParams }
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
  faculdade: string;
  grau: string;
  regime: string;
  morada: string;
  nome_completo: string;
  bi_aluno: string;

  email: string | null; // pode vir null
  telefonicos: string;
  sexo: string;
  data_nascimento: string; // ISO: "1982-05-24T23:00:00.000Z"
  foto:string;
  saldo_atual:number;
  saldo_anterior:number;
  pai: string;
  mae: string;
  naturalidade: string;
  nacionalidade: string;
  estado_civil: string;
};

/* =======================
 * FETCH - Detalhes/estatística do aluno
 * ======================= */
export const fetchStudentEstatisticas = async (
  codigoMatricula: number | string
): Promise<StudentDetail> => {
  const id = String(codigoMatricula).trim();

  const response = await axiosNestGa.get<StudentDetail>(
    `/students/estatistic/${id}`
  );

  return response.data;
};

/* =======================
 * TIPOS - Disciplinas / Cadeiras matriculadas
 * ======================= */
export type DisciplinaMatricula = {
  disciplina: string;
  codigo_disciplina: string;
  semestre: string;       // ex: "I SEMESTRE", "II SEMESTRE"
  duracao: string;        // ex: "Semestral", "Anual"
  classe: string;         // ex: "1º ano", "2º ano"
  ano_lectivo: string;    // ex: "2023-2024"
  horario: string;        // ex: "CARDIO.1.BIOQUI.D-H5"
  sala: string;   
  codigo_horario: number;   // ex: 20373
  estado: string;        // ex: "Aprovado", "Matriculado", etc.
};

export type DisciplinasResponse = {
  data: DisciplinaMatricula[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* =======================
 * PARAMS - Disciplinas matriculadas
 * ======================= */
export type FetchDisciplinasMatriculadasParams = {
  matriculaId: number | string;
  anoLectivo?: string | number;   // ex: "2023-2024" ou 2023
  semestre?: string | number;     // ex: "1", "I", "2", "II", "I SEMESTRE"
  page?: number;
  limit?: number;
};

/* =======================
 * FETCH - Disciplinas / Cadeiras do aluno (matrícula atual ou histórica)
 * ======================= */
export const fetchDisciplinasMatriculadas = async (
  params: FetchDisciplinasMatriculadasParams
): Promise<DisciplinasResponse> => {
  const {
    matriculaId,
    anoLectivo,
    semestre,
    page = 1,
    limit = 25,
  } = params;

  // Monta query params apenas com os valores fornecidos
  const queryParams: Record<string, string | number> = {
    matriculaId: String(matriculaId).trim(),
    page: page,
    limit: limit,
  };

  if (anoLectivo !== undefined && anoLectivo !== null) {
    queryParams.anoLectivo = String(anoLectivo).trim();
  }

  if (semestre !== undefined && semestre !== null) {
    queryParams.semestre = String(semestre).trim();
  }

  const response = await axiosNestGa.get<DisciplinasResponse>(
    "/discipline",
    { params: queryParams }
  );

  return response.data;
};