import { axiosNestGa } from "@/lib/axios-nest-ga";
export type TipoCandidatura = {
  codigo: number;
  designacao: string;
  sigla: string;
};
export async function fetchTipoCandidatura(): Promise<TipoCandidatura[]> {
  const { data } = await axiosNestGa.get("/academic-calendar/application-types/all");
  return data.tipo_candidaturas ?? [];
}
