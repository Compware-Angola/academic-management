import { axiosNestGa } from "@/lib/axios-nest-ga";

export type CandidatoAdmitidoParams = {
  codigoAnoLetivo?: number;
  codigoCurso?: number;
  codigoTurno?: number;
  codigoFaculdade?: number;
  search?: string;
  matriculado?: number;
  localAdmissao?: number;
  page?: number;
  limit?: number;
};

export type CandidatoAdmitido = {
  numero_inscricao: number;
  nome: string;
  contato: string;
  email: string;
  data_preescrincao: string;
  bilhete_identidade: string;
  curso_candidatura: number;
  data_nascimento: string;
  idade: number;
  curso: string;
  matriculado: string;
  local_admissao: string;
};

export type CandidatoAdmitidoResponse = {
  data: CandidatoAdmitido[];
  total: number;
  page: number;
  limit: number;
  totalpages: number;
};

export async function fetchCandidatosAdmitidos(
  params: CandidatoAdmitidoParams
): Promise<CandidatoAdmitidoResponse> {
  const { data } = await axiosNestGa.get(
    "/exames-de-acesso/candidatos-admitidos",
    { params }
  );
  return data;
}