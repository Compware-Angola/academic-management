// services/get-discount-by-sigla.service.ts

import { axiosNestFinance } from "@/lib/axios-nest-finance";

export interface DiscountBySigla {
  taxa: number;
  data_inicio: string;
  data_fim: string;
  estado: number;
  id: number;
  sigla: string;
}

export async function getDiscountBySigla(
  sigla: string,
): Promise<DiscountBySigla[]> {
  const response = await axiosNestFinance.get<DiscountBySigla[]>(
    `/discount/sigla/${sigla}`,
  );

  return response.data ?? [];
}
