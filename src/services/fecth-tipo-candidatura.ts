import { axiosApexGa } from "@/lib/axios-apex-ga";
export type TipoCandidatura = {
  codigo: number;
  designacao: string;
};
export async function fetchTipoCandidatura(): Promise<TipoCandidatura[]> {
  const { data } = await axiosApexGa.get("/uma/tipo-candidatura/all");
  return data.tipo_candidaturas ?? [];
}
