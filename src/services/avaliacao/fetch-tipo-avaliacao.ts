import { axiosApexGa } from "@/lib/axios-apex-ga";
export type TipoAvaliacao = {
  codigo: number;
  designacao: string;
  sigla: string;
};

export async function fetchTipoAvaliacao(): Promise<TipoAvaliacao[]> {
  const { data } = await axiosApexGa.get("uma/tipo-avaliacao/all");

  return data.tipo_avaliacoes ?? [];
}
