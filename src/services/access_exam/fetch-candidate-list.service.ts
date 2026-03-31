import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ProvaPorCandidatoParams = {
  search?: string;
  codigoAnoLetivo?: number;
  codigoCurso?: number;
  codigoPeriodo?: number;
  codigoFaculdade?: number;
  page?: number;
  limit?: number;
};

export type ProvaPorCandidato = {
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
  lista_de_provas: string[];        // array de nomes das provas
};

export type ProvaPorCandidatoResponse = {
  data: ProvaPorCandidato[];
  total: number;
  page: number;
  limit: number;
 
};

export async function fetchProvasPorCandidato(
  params: ProvaPorCandidatoParams
): Promise<ProvaPorCandidatoResponse> {
  const { data } = await axiosNestGa.get(
    "/exames-de-acesso/candidatos/prova",
    { 
      params,
      // Recomendado: forçar encode correto (evita problema com espaços)
      paramsSerializer: (paramsObj) => {
        const searchParams = new URLSearchParams();
        Object.entries(paramsObj).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        return searchParams.toString(); // Axios vai codificar corretamente
      }
    }
  );
  return data;
}