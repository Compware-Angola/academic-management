// src/services/tipoUnidadeService.ts
import { axiosApexGa } from "@/lib/axios-apex-ga";

export interface TipoUnidade {
  codigo: number;
  sigla: string;
  descricao: string;
}

export interface TipoUnidadeResponse {
  tipo_unidade: TipoUnidade[];
}

export async function getTiposUnidade(): Promise<TipoUnidade[]> {
  const response = await axiosApexGa.get<TipoUnidadeResponse>(
    "/uma/tipo-unidade/all"
  );
  return response.data.tipo_unidade;
}