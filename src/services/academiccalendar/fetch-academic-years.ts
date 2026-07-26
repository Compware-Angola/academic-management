import { axiosNestGa } from "@/lib/axios-nest-ga";

export type AcademicYear = {
  codigo: number;
  designacao: string;
  datainicioprimeirosemestre: string | null;
  datafimprimeirosemestre: string | null;
  datainiciosegundosemestre: string | null;
  datafimsegundosemestre: string | null;
  estado: string;
  data_ultima_atualizacao: string;
  utilizador: number;
  status_: number;
  ordem: number | null;
  epoca_exame_acesso: number;
  codigo_tipo_candidatura: number;
  fase_anolectivo: string;
  tipo_candidatura: string;
};

export type AcademicYearResponse = {
  data: AcademicYear[];
};

export type FetchAcademicYearsParams = {
  tipoCandidatura?: number;
};

export async function fetchAcademicYears(
  params: FetchAcademicYearsParams,
): Promise<AcademicYearResponse> {
  const { data } = await axiosNestGa.get("/academic-calendar/anolectivos", {
    params,
  });

  return data;
}
