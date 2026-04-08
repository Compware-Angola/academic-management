import { axiosNestGa } from "@/lib/axios-nest-ga";

export type RegistoPrimarioMatriculado = {
  numero: number;
  nome: string;
  numero_bilhete: string;
  sexo: string;
  idade: number;
  data_nascimento: string;
  provincia: string;
  municipio: string | null;
  pais_origem: string;
  periodo_estudo: string;
  unidade_organica: string;
  nome_curso_inscrito_ensino_superior: string;
  ano_frequencia: number | string;
  situacao_academica: string;
  aproveitamento_anual: number;
};

export type FetchRegistoPrimarioMatriculadosResponse = {
  data: RegistoPrimarioMatriculado[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchRegistoPrimarioMatriculadosParams = {
  page: number;
  limit: number;
  anoLectivo?: number;
  grau?: number;
  anoCurricular?: number;
  estado?: number; // 0=antigos, 1=novos, 2=todos
  search?: string;
};

export async function fetchRegistoPrimarioMatriculadosService({
  page,
  limit,
  anoLectivo = 0,
  grau = 0,
  anoCurricular = 0,
  estado = 2,
  search = "",
}: FetchRegistoPrimarioMatriculadosParams): Promise<FetchRegistoPrimarioMatriculadosResponse> {
  const { data } =
    await axiosNestGa.get<FetchRegistoPrimarioMatriculadosResponse>(
      "/students/registo-primario-matriculados",
      {
        params: {
          page,
          limit,
          anoLectivo,
          grau,
          anoCurricular,
          estado,
          search,
        },
      }
    );

  return data;
}