
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type CandidatoComProvaParams = {
  codigoAnoLetivo?: number;
  codigoCurso?: number;
  dataRealizacao?: string;
  horaInicio?: string;
  codigoSala?:number;
  page?: number;
  limit?: number;
};

export type CandidatoComProva = {
  numero_inscricao: number;
  nome: string;
  numero_bilhete: string;
  codigo_curso: number;
  curso: string;
  codigo_sala: number;
  sala: string;
  codigo_ano_lectivo: number;
  ano_lectivo: string;
  data_realizacao: string;
  hora_inicio: string;
};

export type CandidatoComProvaResponse = {
  data: CandidatoComProva[];
  total: number;
  page: number;
  limit: number;
  totalpages: number;
};

export async function fetchCandidatosComProva(
  params: CandidatoComProvaParams
): Promise<CandidatoComProvaResponse> {
  const { data } = await axiosNestGa.get(
    "/exames-de-acesso/candidatos/prova",
    { params }
  );
  return data;
}