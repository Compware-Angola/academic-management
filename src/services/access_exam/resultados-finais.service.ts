import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ResultadosFinaisParams = {
  search?: string;
  codigoAnoLetivo?: number;
  codigoCurso?: number;
  codigoFaculdade?: number;
  codigoTurno?: number;
  codigoSala?: number;
  codigoCandidato?: number;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
};

export type ResultadoFinal = {
  numero_inscricao: number;
  nome: string;
  bilhete_identidade: string;
  curso_candidatura: number;
  curso: string;
  codigo_faculdade: number;
  faculdade: string;
  codigo_sala: number;
  sala: string;
  nota: number;
  resultado: number;
  data_realizacao: string;
};

export type ResultadosFinaisResponse = {
  data: ResultadoFinal[];
  total: number;
  page: number;
  limit: number;
  totalpages: number;
};

export async function fetchResultadosFinais(
  params: ResultadosFinaisParams
): Promise<ResultadosFinaisResponse> {
  const { data } = await axiosNestGa.get(
    "/exames-de-acesso/candidatos/resultados-finais",
    { params }
  );
  return data;
}