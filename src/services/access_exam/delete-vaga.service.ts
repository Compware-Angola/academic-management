import { axiosNestGa } from "@/lib/axios-nest-ga";

export type DeleteVagaResponse = {
  message: string;
};

export async function deleteVaga(id: number) {
  const { data } = await axiosNestGa.delete<DeleteVagaResponse>(
    `/vagas/${id}`,
    {
      showSuccess: true,
    }
  );

  return data;
}
