import { axiosApexGa } from "@/lib/axios-apex-ga";

export type MesesRoot = {
  meses: Mes[];
};

export type Mes = {
  codigo: number;
  designacao: string;
  ordem_mes: number;
  ano_lectivo: number;
  data_inicial: string;
  data_final: string;
};

type MesTempParams = {
  id: number;
};

export async function fetchMesTemp(params: MesTempParams) {
  const { id } = params;
  const res = await axiosApexGa.get<MesesRoot>(`/uma/mes-temp/${id}`);
  return res.data.meses || [];
}
