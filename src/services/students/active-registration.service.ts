import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ActiveRegistrationPayload = {
  codigoMatricula: number;
  anoLectivoId: number;
};

export async function activeRegistration(payload: ActiveRegistrationPayload) {
  const { data } = await axiosNestGa.put(
    `/students/active-registration`,
    payload,
  );
  return data;
}
