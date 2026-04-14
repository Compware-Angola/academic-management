import { axiosNestGa } from "@/lib/axios-nest-ga";

export type MapaAnualFinalista = {
  numero: number;
  nome: string;
  numero_bilhete: string;
  genero: string;
  idade: number;
  data_nascimento: string;
  provincia: string;
  municipio: string;
  pais_origem: string;
  periodo_estudo: string;
  unidade_organica: string;
  curso: string;
  ano_primeira_matricula: string | number;
  trabalhador: string;
  duracao_curso: number;
  media_final: number;
};

export type FetchMapaAnualFinalistasResponse = {
  data: MapaAnualFinalista[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchMapaAnualFinalistasParams = {
  page: number;
  limit: number;
  anoLectivo: number;
  grau?: number;
  search?: string;
};

export async function fetchMapaAnualFinalistasService({
  page,
  limit,
  anoLectivo,
  grau = 0,
  search = "",
}: FetchMapaAnualFinalistasParams): Promise<FetchMapaAnualFinalistasResponse> {
  const { data } = await axiosNestGa.get<FetchMapaAnualFinalistasResponse>(
    "/students/mapa-anual-finalistas",
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