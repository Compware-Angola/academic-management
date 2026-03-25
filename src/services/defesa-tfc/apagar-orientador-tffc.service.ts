import { axiosNestGa } from "@/lib/axios-nest-ga";

export async function apagarOrientadorService(
  orientadorId: number,
  anoLectivoId: number,
) {
  const { data } = await axiosNestGa.delete(
    `defense-management-tfc/orientadores/${orientadorId}`,
    { data: { anoLectivoId } },
  );
  return data;
}