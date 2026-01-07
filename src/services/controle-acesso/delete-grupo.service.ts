import { axiosNestGa } from "@/lib/axios-nest-ga";

export type DeleteGrupoResponse = {
  message: string;
};

export async function deleteGrupoService(
  grupoId: number | string
): Promise<DeleteGrupoResponse> {
  const { data } = await axiosNestGa.delete<DeleteGrupoResponse>(
    `/groups/${grupoId}`
  );

  return data;
}
