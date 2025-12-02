import { axiosNestGa } from "@/lib/axios-nest-ga";

export async function deleteExemptDay(codigo: number): Promise<void> {
  await axiosNestGa.delete(`exempt-days/${codigo}`);
}
