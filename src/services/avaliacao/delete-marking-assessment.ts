import { axiosNestGa } from "@/lib/axios-nest-ga";

export async function deleteMarkingAssessmentService(
  id: number,
): Promise<void> {
  await axiosNestGa.delete(`/assessment/delete-calendario-prova/${id}`);
}
