import { axiosNestGa } from "@/lib/axios-nest-ga";

export type OrientadorPayload = {
  docenteId: number;
  cursoId: number;
  anoLectivoId: number;
  estado: string;
};


export async function createOrientadorService(
  payload: OrientadorPayload,
) {
  const { data } = await axiosNestGa.post(
    "defense-management-tfc/orientadores",
    payload,
  );

  return data;
}
