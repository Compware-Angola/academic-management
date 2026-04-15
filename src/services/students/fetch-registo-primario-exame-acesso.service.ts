import { axiosNestGa } from "@/lib/axios-nest-ga";

export type RegistoPrimarioExamesAcesso = {
  numero: number;
  nome: string;
  numero_bilhete: string;
  sexo: string;
  idade: number;
  data_nascimento: string;
  provincia_residencia: string;
  pais_origem: string;
  municipio: string;
  periodo_estudo: string;
  curso: string;
  nota_exame_acesso: number;
  escola_ensino_medio: string;
  trabalhador: string;
  unidade_organica: string;
  necessidade_especial: string;
  proveniencia: string;
  curso_ensino_medio: string;
  estudante_matriculado_primeira_vez: string;
  admissao: string;
};

export type FetchRegistoPrimarioExamesAcessoResponse = {
  data: RegistoPrimarioExamesAcesso[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchRegistoPrimarioExamesAcessoParams = {
  page: number;
  limit: number;
  anoLectivo?: number;
  grau?: number;
  search?: string;
};

export async function fetchRegistoPrimarioExamesAcessoService({
  page,
  limit,
  anoLectivo = 0,
  grau = 0,
  search = "",
}: FetchRegistoPrimarioExamesAcessoParams): Promise<FetchRegistoPrimarioExamesAcessoResponse> {
  const { data } =
    await axiosNestGa.get<FetchRegistoPrimarioExamesAcessoResponse>(
      "/students/registo-primario-exames-acesso",
      {
        params: {
          page,
          limit,
          anoLectivo,
          grau,
          search,
        },
      }
    );

  return data;
}