import { axiosApexGa } from "@/lib/axios-apex-ga";
export type TipoDeSala = {
  "pkTipoAula": number,
  "designacao": string
};
export async function fetchTipoDeSala(): Promise<TipoDeSala[]> {
  const { data } = await axiosApexGa.get<{items:TipoDeSala[]}>("/uma/tipo_salas");
  return data.items ?? [];
}
