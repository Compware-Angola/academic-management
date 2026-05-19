import { axiosNestFinance } from "@/lib/axios-nest-finance";

export type ListUtilizadoresFilters = {
  search?: string;
  limit?: number;
  page?: number;
};

type Utilizadores = {
  nome: string;
  codigo: number;
};

export async function listUtilizadoresService(
  filters?: ListUtilizadoresFilters,
): Promise<Utilizadores[]> {
  const { data } = await axiosNestFinance.get("/utilizadores", {
    params: filters,
  });

  return data.data;
}
