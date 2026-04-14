import { axiosNestGa } from "@/lib/axios-nest-ga";

export type InscricoesPorDiaParams = {
  codigoAnoLetivo?: number;
  codigoCurso?: number;
  codigoFaculdade?: number;
  codigoTurno?: number;
  page?: number;
  limit?: number;
};

export type InscricaoPorDia = {
  data: string;
  subtotal: number;
};

export type InscricoesPorDiaResponse = {
  data: InscricaoPorDia[];
  total: number;
  totalgeralcandidatos: number;
  page: number;
  limit: number;
  totalpages: number;
};

export async function fetchInscricoesPorDia(
  params: InscricoesPorDiaParams
): Promise<InscricoesPorDiaResponse> {
  const { data } = await axiosNestGa.get(
    "/exames-de-acesso/estatistica/dia",
    { params }
  );
  return data;
}