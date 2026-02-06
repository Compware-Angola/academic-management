import { axiosNestFinance } from "@/lib/axios-nest-finance";

export interface MotivoIsencaoResponse {
  codigo: number;
  codigomotivo: string;
  descricao: string;
}

export async function fetchMotivoIsencaoDropdown(): Promise<MotivoIsencaoResponse[]> {
  const { data } = await axiosNestFinance.get<MotivoIsencaoResponse[]>(
    "/shared/motivo-isencao-dropdown"
  );

  return data;
}
