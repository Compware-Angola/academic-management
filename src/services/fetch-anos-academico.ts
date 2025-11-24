import { axiosApexGa } from "@/lib/axios-apex-ga";
export type AnoAcademico = {
  codigo: number;
  designacao: string;
  estado: string;
};
export async function fetchAnosAcademicos(): Promise<AnoAcademico[]> {
  const { data } = await axiosApexGa.get("/academic-year/all");
  return data.anolectivos ?? [];
}
