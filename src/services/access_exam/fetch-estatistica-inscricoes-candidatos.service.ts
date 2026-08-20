import { axiosNestGa } from "@/lib/axios-nest-ga";

export type InscricoesPorDataParams = {
  codigoAnoLetivo?: number;
  codigoCurso?: number;
  descCurso?: string;
  codigoFaculdade?: number;
  descFaculdade?: string;
  codigoTurno?: number;
  descTurnoTurno?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
};

export type InscricaoPorData = {
  data: string;
  qt_manha: number;
  qt_tarde: number;
  qt_noite: number;
  qt_diurno: number;
  qt_noturno: number;
  pagos?: number;
  total_dia: number;
};

export type FiltrosDesignacoes = {
  curso: string | null;
  faculdade: string | null;
  turno: string | null;
  anolectivo: string | null;
};

export type InscricoesPorDataResponse = {
  data: InscricaoPorData[];
  total: number;
  totalgeralcandidatos?: number;
  totalpagos?: number;
  filtros: FiltrosDesignacoes;
  page: number;
  limit: number;
  totalpages: number;
};

export async function fetchInscricoesPorData(
  params: InscricoesPorDataParams,
): Promise<InscricoesPorDataResponse> {
  const { data } = await axiosNestGa.get(
    "/exames-de-acesso/estatistica/candidatos",
    { params },
  );
  return data;
}
