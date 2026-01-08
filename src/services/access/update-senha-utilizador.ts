import { axiosNestGa } from "@/lib/axios-nest-ga";

export type UpdatePasswordParams = {
  utilizadorId: number;
  novaSenha: string;
};

export async function updateUserPassword(
  params: UpdatePasswordParams
): Promise<void> {
  await axiosNestGa.put("/acess_management/teacher-password", params);
}
