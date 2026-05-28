import { axiosNestGa } from "@/lib/axios-nest-ga";

export async function deletePrazo(prazoId: number) {
  await axiosNestGa.delete(`/academic-activities/terms/${prazoId}`);
}
