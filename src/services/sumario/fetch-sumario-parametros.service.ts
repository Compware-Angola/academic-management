import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface ParametroArgs {
  valor: number | boolean;
}

export interface ParametroItem {
  pk_parametro: number;
  designacao: string;
  sigla: string;
  descricao: string | null;
  args: ParametroArgs;
}

export interface ParametrosResponse {
  data: ParametroItem[];
}

export async function fetchSumarioParametros(): Promise<ParametrosResponse> {
  const { data } = await axiosNestGa.get<ParametrosResponse>("sumario/parametros");
  return data;
}