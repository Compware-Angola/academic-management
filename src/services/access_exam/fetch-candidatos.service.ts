import { axiosNestGa } from "@/lib/axios-nest-ga";

export type Documento = {
  id: number;
  codigo_documento: number;
  tipo_documento: string;
  link: string;
  candidato_id: number;
};

export type Candidato = {
  numero_inscricao: number;
  nome: string;
  contato: string;
  contato_emergencia: string | null;
  email: string;
  morada_completa: string;
  data_preescrincao: string;
  sexo: string;
  estado_civil: string;
  codigo_nacionalidade: number;
  nacionalidade: string;
  nome_pai: string;
  codigo_profissao_pai: number;
  profissao_pai: string;
  nome_mae: string;
  codigo_profissao_mae: number;
  profissao_mae: string;
  numero_bilhete: string;
  codigo_ano_lectivo: number;
  ano_lectivo: string;
  codigo_curso: number;
  curso: string;
  codigo_curso_opcional_1: number;
  curso_opcional_1: string;
  codigo_curso_opcional_2: number;
  curso_opcional_2: string;
  media_final: number;
  codigo_periodo: number;
  periodo: string;
  codigo_periodo_opcional: number;
  periodo_opcional: string;
  codigo_tipo_candidatura: number;
  tipo_candidatura: string;
  tentou_universidade_publica: number;
  doc_universidade_valido: number;
  documentos: Documento[];
};

export type FilterCandidatoParams = {
  search?: string;
  page?: number;
  limit?: number;
  codigoTurno?: number;
  codigoCandidato?: number;
  codigoFaculdade?: number;
  codigoCurso?: number;
  codigoAnoLetivo?: number;
};

export type CandidatoResponse = {
  data: Candidato[];
  total: number;
  page: number;
  limit: number;
  totalpages: number;
};

export async function fetchCandidatos(
  filters: FilterCandidatoParams = {},
): Promise<CandidatoResponse> {
  const { data } = await axiosNestGa.get("/exames-de-acesso/candidato", {
    params: {
      ...filters,
    },
  });

  return data;
}

export async function validarDocumentoUniversidadePublica(id: number) {
  const { data } = await axiosNestGa.post(
    `/exames-de-acesso/validar-documento-publico/${id}`,
    {},
    { showSuccess: true },
  );

  return data;
}
