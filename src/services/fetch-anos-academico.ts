import { axiosNestGa } from "@/lib/axios-nest-ga";
export type AnoAcademico = {
  codigo: number;
  designacao: string;
  estado: string;
};
export async function fetchAnosAcademicos(): Promise<AnoAcademico[]> {
  const { data } = await axiosNestGa.get("/academic-calendar/academic-year/all");
  return data.anolectivos ?? [];
}
