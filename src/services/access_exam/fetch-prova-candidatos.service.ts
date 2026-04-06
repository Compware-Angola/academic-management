import { axiosNestGa } from "@/lib/axios-nest-ga";

export type CandidatoProva = {
  numero_inscricao: number;
  nome: string;
  codigo_ano_lectivo: number;
  ano_lectivo: string;
  codigo_curso: number;
  curso: string;
  codigo_periodo: number;
  periodo: string;
  codigo_faculdade: number;
  faculdade: string;
  lista_de_provas: string[];
};

export type FilterCandidatoProvaParams = {
  search?: string;
  page?: number;
  limit?: number;
  codigoAnoLetivo?: number;
  codigoFaculdade?: number;
  codigoCurso?: number;
  codigoTurno?: number;
};

export type CandidatoProvaResponse = {
  data: CandidatoProva[];
  total: number;
  page: number;
  limit: number;
};

export async function fetchListProvaPorCandidato(
  filters: FilterCandidatoProvaParams = {}
): Promise<CandidatoProvaResponse> {
  const { data } = await axiosNestGa.get("/exames-de-acesso/candidatos/prova/lista", {
    params: {
      ...filters,
    },
  });

  return data;
}