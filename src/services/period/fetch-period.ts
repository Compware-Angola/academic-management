import { axiosApexGa } from "@/lib/axios-apex-ga";
export type Periodo = {
  codigo: number;
  designacao: string;
};
export async function fetchPeriodo(): Promise<Periodo[]> {
  const { data } = await axiosApexGa.get("/uma/period/all");
  return data.periodos ?? [];
}
