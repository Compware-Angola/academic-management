import { axiosNestGa } from "@/lib/axios-nest-ga";

export type InscricoesPorDataParams = {
  codigoAnoLetivo?: number;
  codigoCurso?: number;
  codigoFaculdade?: number;
  codigoTurno?: number;
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
  total_dia: number;
};

export type InscricoesPorDataResponse = {
  data: InscricaoPorData[];
  total: number;
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
