import { axiosNestGa } from "@/lib/axios-nest-ga";
export type AnoAcademico = {
  codigo: number;
  designacao: string;
  estado: string;
};
export async function fetchAnosAcademicos(params?: { tipo_candidatura?: number }): Promise<AnoAcademico[]> {
  const { data } = await axiosNestGa.get("/academic-calendar/academic-year/all", { params });
  return data.anolectivos ?? [];
}
