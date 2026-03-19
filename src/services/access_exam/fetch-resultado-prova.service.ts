
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ResultadoProvaParams = {
  codigoAnoLetivo?: number;
  codigoCurso?: number;
  codigoTurno?: number;
  codigoFaculdade?: number;
  codigoSala?: number;
  resultado?: number;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
};

export type ResultadoProva = {
  numero_inscricao: number;
  nome: string;
  numero_bilhete: string;
  codigo_ano_lectivo: number;
  ano_lectivo: string;
  codigo_curso: number;
  curso: string;
  codigo_periodo: number;
  periodo: string;
  codigo_sala: number;
  sala: string;
  data_realizacao: string;
  codigo_faculdade: number;
  faculdade: string;
  nota: number;
  resultado: number;
};

export type ResultadoProvaResponse = {
  data: ResultadoProva[];
  total: number;
  page: number;
  limit: number;
  totalpages: number;
};

export async function fetchResultadoProva(
  params: ResultadoProvaParams
): Promise<ResultadoProvaResponse> {
  const { data } = await axiosNestGa.get(
    "/exames-de-acesso/candidatos/prova/resultado",
    { params }
  );
  return data;
}