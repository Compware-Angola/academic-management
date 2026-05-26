import { axiosNestFinance } from "@/lib/axios-nest-finance";

export async function switchEstadoCreditoEducacionalService({
  codigo,
}: {
  codigo: number;
}) {
  const { data } = await axiosNestFinance.patch(
    `/credito-educacional/${codigo}/switch`,
  );
  return data;
}
