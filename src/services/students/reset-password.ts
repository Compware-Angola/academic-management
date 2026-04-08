import { axiosNestGa } from "@/lib/axios-nest-ga";
export type ResetPasswordPayload = {
  codigoMatricula: number;
  senha: string;
};
export async function resetPassword(payload: ResetPasswordPayload) {
  const { data } = await axiosNestGa.patch(`/students/reset-password`, payload);
  return data;
}