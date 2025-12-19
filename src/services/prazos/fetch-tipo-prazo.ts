import { axiosApexGa } from "@/lib/axios-apex-ga";
export type Root = {
  tiposPrazo: TiposPrazo[];
};

export type TiposPrazo = {
  pk_tipo_prazo: number;
  designacao: string;
};

export async function fetchTiposPrazo() {
  const res = await axiosApexGa.get<Root>("uma/tipo-prazo/all");
  return res.data.tiposPrazo || [];
}
