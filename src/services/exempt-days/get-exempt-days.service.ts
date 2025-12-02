import { axiosApexGa } from "@/lib/axios-apex-ga";


export interface DiaIsento {
  codigo: number;
  designacao: string;
  data_inicio: string;
  data_fim: string;
  estado: number;
}

export async function getExemptDays(): Promise<DiaIsento[]> {
  const response = await axiosApexGa.get(
    "ga/exempt-days"
  );

  return response.data.dias_isentos ?? [];
}
