import { axiosNestGa } from "@/lib/axios-nest-ga";

/* =======================
 * PARAMS - Sugestões de alunos
 * ======================= */
export type StudentSugestoesParams = {
  search?: string; // pode ser parte do nome, BI, código de matrícula, etc.
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
  params: StudentSugestoesParams = {},
): Promise<StudentSugestao[]> => {
  const { search = "" } = params;

  // Só envia o parâmetro se tiver valor (evita ?search= na URL)
  const queryParams = search.trim() ? { search } : {};

  const response = await axiosNestGa.get<StudentSugestao[]>(
    "/students/find/sugestoes",
    { params: queryParams },
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
  curso_codigo: number;
  data_emissao_bi: string;
  data_validade_bi: string;
  email: string | null; // pode vir null
  contacto: string | null;
  contacto_alternativo: string | null;
  sexo: string;
  data_nascimento: string; 
  ocupacao_codigo: number;
  profissao_codigo: number;
  foto: string;
  saldo_atual: number;
  saldo_anterior: number;
  pai: string;
  mae: string;
  naturalidade: string;
  nacionalidade: string;
  estado_civil: string;
  periodo_codigo:number;
};

/* =======================
 * FETCH - Detalhes/estatística do aluno
 * ======================= */
export const fetchStudentEstatisticas = async (
  codigoMatricula: number | string,
): Promise<StudentDetail> => {
  const id = String(codigoMatricula).trim();

  const response = await axiosNestGa.get<StudentDetail>(
    `/students/estatistic/${id}`,
  );

  return response.data;
};

/* =======================
 * TIPOS - Disciplinas / Cadeiras matriculadas
 * ======================= */
export type DisciplinaMatricula = {
  disciplina: string;
  codigo_disciplina: string;
  codigo_grade_curricular:number;
  codigo:number;
  semestre: string; // ex: "I SEMESTRE", "II SEMESTRE"
  duracao: string; // ex: "Semestral", "Anual"
  classe: string; // ex: "1º ano", "2º ano"
  ano_lectivo: string; // ex: "2023-2024"
  horario: string; // ex: "CARDIO.1.BIOQUI.D-H5"
  sala: string;
  codigo_horario: number; // ex: 20373
  estado: string; // ex: "Aprovado", "Matriculado", etc.
  codigo_classe: number;
  estado_codigo:number;
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
  anoLectivo?: string | number; 
  semestre?: string | number; 
  classes?: string | number; 
  page?: number;
  limit?: number;
};

/* =======================
 * FETCH - Disciplinas / Cadeiras do aluno (matrícula atual ou histórica)
 * ======================= */
export const fetchDisciplinasMatriculadas = async (
  params: FetchDisciplinasMatriculadasParams,
): Promise<DisciplinasResponse> => {
  const { matriculaId, anoLectivo, semestre, page = 1, limit = 25, classes } = params;

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

  if (classes !== undefined && classes !== null) {
    queryParams.classes = String(classes).trim();
  }

  const response = await axiosNestGa.get<DisciplinasResponse>("/discipline", {
    params: queryParams,
  });

  return response.data;
};

//OBTER TODOS OS ESTUDANTES
export type ListStudentsPayload = {
  anoLectivo?: number;
  codigoCurso?: number;
  faculdadeId?: number;
  codigoMatricula?: number;
  page?: number;
  limit?: number;
};

export type StudentItem = {
  codigo_matricula: number;
  nome_completo: string;
  bi: string;
  curso: string;
  candidatura: string;
};

export type ListStudentsResponse = {
  data: StudentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getListStudentsService(
  payload: ListStudentsPayload,
): Promise<ListStudentsResponse> {
  const {
    anoLectivo,
    codigoCurso,
    faculdadeId,
    codigoMatricula,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestGa.get<ListStudentsResponse>("/students", {
    params: {
      //anoLectivo,
      codigoCurso,
      faculdadeId,
      codigoMatricula,
      page,
      limit,
    },
  });

  return data;
}


export type UpdatePersonalDataPayload = {
  codigoMatricula: number;
  nomeCompleto?: string;
  dataNascimento?: string;
  genero?: string;
  numeroBI?: string;
  dataEmissao?: string;
  dataValidade?: string;
  nacionalidade?: string;
  nomePai?: string;
  nomeMae?: string;
  profissao?: number;
  ocupacao?: number;
  naturalidade?: string;
  morada?: string;
};

export async function updatePersonalData(data: UpdatePersonalDataPayload) { 
  const response = await axiosNestGa.put(`/students/personal-data`, data);
  return response.data;
}

export type UpdateGradeCurricularHorarioAlunoPayload = {
    codigoGradeCurricularAluno: number;
    horarioID: number;
};

export async function updateGradeCurricularHorarioAluno(params: UpdateGradeCurricularHorarioAlunoPayload): Promise<{message: string}> {
  const { data } = await axiosNestGa.put(`/students/horario-grade-curricular`, params);
  return data;
}