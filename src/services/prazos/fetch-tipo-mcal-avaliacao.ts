import { axiosApexGa } from "@/lib/axios-apex-ga";
export type MCALTipoAvaliacao = {
  codigo: number;
  designacao: string;
  sigla: string;
};

export async function fetchMCALTipoAvaliacao(): Promise<MCALTipoAvaliacao[]> {
  const { data } = await axiosApexGa.get("ga/mcal-tipo-avaliacao");

  return data.tipo_avaliacoes ?? [];
}
