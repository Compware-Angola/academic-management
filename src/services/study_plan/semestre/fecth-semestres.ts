import { axiosApexGa } from "@/lib/axios-apex-ga";
export type Semestre = {
  codigo: number;
  designacao: string;
};
export async function fetchSemestres(): Promise<Semestre[]> {
  const { data } = await axiosApexGa.get("/uma/semestre/all");
  return data.semestres ?? [];
}
