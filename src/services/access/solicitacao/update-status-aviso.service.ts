import { axiosNestGa } from "@/lib/axios-nest-ga";

export type UpdateStatusAvisoPayload = {
  id: number;
  status: number;
};

export type UpdateStatusAvisoResponse = {
  message: string;
};

export async function updateStatusAvisoService({
  id,
  status,
}: UpdateStatusAvisoPayload): Promise<UpdateStatusAvisoResponse> {
  const { data } = await axiosNestGa.patch<UpdateStatusAvisoResponse>(
    `/solicitacoa/aviso/${id}/status`,
    { status }
  );

  return data;
}