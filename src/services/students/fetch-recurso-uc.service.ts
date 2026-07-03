import { axiosNestGa } from "@/lib/axios-nest-ga";

type NotaDisciplina = {
  codigo: number;
  disciplina: string;
  nota: number;
  horas_teoricas: number;
  horas_teorico_praticas: number;
  horas_praticas: number;
  duracao_nome: string;
  ano_lectivo_nome: string;
  semestre: number;
  classe: number;
};

export interface NotasServiceParams {
  codigoMatricula: number;
  anoMin: number;
  anoMax: number;
}
export type BaseParams = {
  anoLetivo: number;
  matricula: number;
};
export type Cadeira = {
  codigoGradeAluno: number;
  gradeCurricula: number;
  disciplina: string;
  unidadeCurricular: string;
  semestre: string;
  duracao: string;
  ano: string;
  media: string;
  resultado: string;
  formula: string[];
  obs: string[];
};

export type ResultadoAluno = {
  total: number;
  matricula: number;
  anoLectivo: number;
  nomeCompleto: string;
  cadeiras: Cadeira[];
};

export type InscricaoRecursoPayload = {
  codigoMatricula: number;
  gradesAlunos: GradeRecursoAluno[];
};

export type GradeRecursoAluno = {
  codigoGradeAluno: number;
  codigoGrade: number;
  unidadeCurricular: string;
};

export async function getCadeirasRecurso({ anoLetivo, matricula }: BaseParams) {
  const response = await axiosNestGa.get<ResultadoAluno>(
    `students/provas/recurso/${anoLetivo}/${matricula}`,
  );
  return response?.data?.cadeiras;
}

export async function inscreverRecurso({
  codigoMatricula,
  gradesAlunos,
}: InscricaoRecursoPayload) {
  const response = await axiosNestGa.post(
    `students/provas/recurso/${codigoMatricula}`,
    { gradesAlunos }, // body direto, sem wrapper
  );
  return response.data;
}

export async function getCadeirasEspecial({
  anoLetivo,
  matricula,
}: BaseParams) {
  const response = await axiosNestGa.get<ResultadoAluno>(
    `students/provas/epoca-especial/${anoLetivo}/${matricula}`,
  );

  return response?.data?.cadeiras;
}

export type InscricaoEpocaEspecialPayload = {
  codigoMatricula: number;
  gradesAlunos: GradeRecursoAluno[];
};

export async function inscreverEpocaEspecial({
  codigoMatricula,
  gradesAlunos,
}: InscricaoEpocaEspecialPayload) {
  const response = await axiosNestGa.post(
    `students/provas/epoca-especial/${codigoMatricula}`,
    { gradesAlunos },
  );
  return response.data;
}
