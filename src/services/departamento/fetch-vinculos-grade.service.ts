// services/vincular.service.ts (ou onde estiver fetchVinculosGrade)
import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface VinculoGrade {
  codigoCurso: number;
  nomeCurso: string;
  codigoClasse: number;
  anoCurricular: string;
  codigoSemestre: number;
  codigoVinculo: number;
  temOral: boolean;
  temPratica: boolean;
  codigoPlanoGrade: number;
}

export interface VinculosGradeResponse {
  codigoGrade: number;
  anoLetivo: number;
  total: number;
  vinculos: VinculoGrade[];
}

export async function fetchVinculosGrade(params: {
  codigoGrade: number;
  anoLetivo: number;
  codigoCurso?: number;
}): Promise<VinculosGradeResponse> {
  const { data } = await axiosNestGa.get("/discipline/vincular/consultar", {
    params,
  });
  return data;
}

export interface DesvincularResponse {
  message: string;
  codigoVinculo: number;
  codigoGrade: number;
  codigoCurso: number;
  codigoAnoLectivo: number;
}

export async function desvincularUnidadeCurricular(
  codigoVinculo: number,
): Promise<DesvincularResponse> {
  const { data } = await axiosNestGa.delete(
    `/discipline/plano-curricular/desvincular/${codigoVinculo}`,
  );
  return data;
}
