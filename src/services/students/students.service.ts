import { axiosNestFinance } from "@/lib/axios-nest-finance";
import { axiosNestGa } from "@/lib/axios-nest-ga";



export type StudentSugestoesParams = {
  search?: string;
};


export type StudentSugestao = {
  codigo_matricula: number;
  bi: string;
  curso: string;
  periodo: string;
  nome_completo: string;
  estado: string;
  is_bolseiro?: number;
};


export const fetchStudentsSugestoes = async (
  params: StudentSugestoesParams = {},
): Promise<StudentSugestao[]> => {
  const { search = "" } = params;

  const queryParams = search.trim() ? { search } : {};

  const response = await axiosNestGa.get<StudentSugestao[]>(
    "/students/find/sugestoes",
    { params: queryParams },
  );

  return response.data;
};


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
  email: string | null;
  contacto: string | null;
  contacto_alternativo: string | null;
  sexo: string;
  data_nascimento: string;
  ocupacao_codigo: number;
  classe: string;
  profissao_codigo: number;
  foto: string;
  saldo_atual: number;
  saldo_anterior: number;
  pai: string;
  mae: string;
  naturalidade: string;
  nacionalidade: string;
  estado_civil: string;
  periodo_codigo: number;

};


export const fetchStudentEstatisticas = async (
  codigoMatricula: number | string,
): Promise<StudentDetail> => {
  const id = String(codigoMatricula).trim();

  const response = await axiosNestGa.get<StudentDetail>(
    `/students/estatistic/${id}`,
  );

  return response.data;
};



export type InfoBolsaEstudante = {
  isBolseiro: boolean;
  codigo: number;
  codigo_matricula: number;
  nome_completo: string;
  bilhete_identidade: string;
  curso: string;
  codigo_utilizador: number;
  canal: string | null;
  created_at: string;
  updated_at: string | null;
  data_inicio_bolsa: string | null;
  data_fim_bolsa: string | null;
  codigo_instituicao: number | null;
  instituicao: string | null;
  codigo_anolectivo: number;
  ano_lectivo: string;
  observacao: string | null;
  historico: string | null;
  status_: string | null;
  semestre: number;
  estadobolsa: string | null;
  tipo_aluno_id: number | null;
  valor_desconto: number;
  codigo_tipo_desconto: number;
  tipo_desconto: string;
  sigla: string;
  codigo_tipo_credito: number;
  tipo_credito: string;
  codigo_bolsa: number;
  bolsa: string;
  isentar_multa: string | null;
}

export const fetchInfoBolsaEstudante = async (
  codigoMatricula: number | string,
): Promise<InfoBolsaEstudante> => {
  const id = String(codigoMatricula).trim();

  const response = await axiosNestFinance.get<InfoBolsaEstudante>(
    `/credito-educacional/dados-info?codigoMatricula=${id}`,
  );

  return response.data;
};

export type DisciplinaMatricula = {
  disciplina: string;
  codigo_disciplina: string;
  codigo_grade_curricular: number;
  codigo: number;
  semestre: string;
  duracao: string;
  classe: string;
  ano_lectivo: string;
  horario: string;
  sala: string;
  codigo_horario: number;
  estado: string;
  codigo_classe: number;
  estado_codigo: number;
};

export type DisciplinasResponse = {
  data: DisciplinaMatricula[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};


export type FetchDisciplinasMatriculadasParams = {
  matriculaId: number | string;
  anoLectivo?: string | number;
  semestre?: string | number;
  classes?: string | number;
  page?: number;
  limit?: number;
};


export const fetchDisciplinasMatriculadas = async (
  params: FetchDisciplinasMatriculadasParams,
): Promise<DisciplinasResponse> => {
  const { matriculaId, anoLectivo, semestre, page = 1, limit = 25, classes } = params;

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

export async function updateGradeCurricularHorarioAluno(params: UpdateGradeCurricularHorarioAlunoPayload): Promise<{ message: string }> {
  const { data } = await axiosNestGa.put(`/students/horario-grade-curricular`, params);
  return data;
}

export type RestoreGradeCurricularAlunoPayload = {
  codigoGradeCurricularAluno: number;
};

export async function restoreGradeCurricularAluno(params: RestoreGradeCurricularAlunoPayload): Promise<{ message: string }> {
  const { data } = await axiosNestGa.put(`/students/restore-grade-curricular/${params.codigoGradeCurricularAluno}`);
  return data;
}

export type DeleteGradeCurricularAlunoPayload = {
  codigoGradeCurricularAluno: number;
};

export async function deleteGradeCurricularAluno(params: DeleteGradeCurricularAlunoPayload): Promise<{ message: string }> {
  const { data } = await axiosNestGa.delete(`/students/grade-curricular/${params.codigoGradeCurricularAluno}`);
  return data;
}

export type DefinirEspecialidadePayload = {
  codigoMatricula: number;
  codigoCursoEspecialidade: number;
};

export async function definirEspecialidade(params: DefinirEspecialidadePayload): Promise<{ message: string }> {
  const { data } = await axiosNestGa.put(`/students/definir-especialidade`, params);
  return data;
}