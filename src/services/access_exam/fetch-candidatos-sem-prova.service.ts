
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type CandidatoSemProvaParams = {
  codigoAnoLetivo?: number;
  codigoCurso?: number;
  codigoTurno?: number;
  filtroProva?: "sem_prova" | "com_prova";
  statusProva?:number
  page?: number;
  limit?: number;
};

export type CandidatoSemProva = {
  codigo: number;
  nome: string;
  contato: string;
  sexo: string;
  data_candidatura: string;
  codigo_tipo_candidatura: number;
  tipo_candidatura: string;
  estado: string;
  user_id: number;
  codigo_ano_lectivo: number;
  ano_lectivo: string;
  estado_ano_lectivo: string;
  codigo_curso: number;
  curso: string;
  codigo_periodo: number;
  periodo: string;
  candidato_prova_codigo: number | null;
  data_realizacao: string | null;
  hora_inicio: string | null;
  hora_fim: string | null;
  status_prova: string | null;
};

export type CandidatoSemProvaResponse = {
  data: CandidatoSemProva[];
  total: number;
  page: number;
  limit: number;
  totalpages: number;
};

export async function fetchCandidatosSemProva(
  params: CandidatoSemProvaParams
): Promise<CandidatoSemProvaResponse> {
  const { data } = await axiosNestGa.get(
    "/exames-de-acesso/candidatos/prova/marcacao",
    { params }
  );
  return data;
}