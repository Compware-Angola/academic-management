import { axiosNestGa } from "@/lib/axios-nest-ga";

export type NotaPrevistaParams = {
  codigoAnoLetivo?: number;
  codigoCurso?: number;
  codigoSala?: number;
  dataRealizacao?: string;
  horaInicio?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type NotaPrevista = {
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
  prova_id: number;
  nota_prevista: number;
  resultado_previsto: string;
};

export type NotaPrevistaResponse = {
  data: NotaPrevista[];
  total: number;
  page: number;
  limit: number;
  totalpages: number;
};

export async function fetchNotaPrevista(
  params: NotaPrevistaParams,
): Promise<NotaPrevistaResponse> {
  const { data } = await axiosNestGa.get(
    "/exames-de-acesso/nota-prevista",
    { params },
  );
  return data;
}