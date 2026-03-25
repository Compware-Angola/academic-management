import { axiosNestGa } from "@/lib/axios-nest-ga";

export async function apagarVinculoService(vinculoId: number) {
  const { data } = await axiosNestGa.delete(
    `defense-management-tfc/vinculos/${vinculoId}`,
  );
  return data;
}