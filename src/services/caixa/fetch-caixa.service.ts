import { axiosApexGa } from "@/lib/axios-apex-ga";

export type Caixa = {
  codigo: number;
  descricao: string;
};

export async function fetchCaixas(): Promise<Caixa[]> {
  const { data } = await axiosApexGa.get("/uma/check-outs");
  return data.caixas ?? [];
}
