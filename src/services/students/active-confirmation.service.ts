import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ActiveConfirmationPayload = {
  codigoMatricula: number
};

export async function activeConfirmation(payload: ActiveConfirmationPayload) {
  const { data } = await axiosNestGa.put(
    `/students/acitve-confirmation/${payload.codigoMatricula}`
  );
  return data;
}
