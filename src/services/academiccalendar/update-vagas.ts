import { axiosNestGa } from "@/lib/axios-nest-ga";
export type UpdateVagasPayload = { id: number; num_vagas: number };
export async function updateVagas(payload: UpdateVagasPayload) {
  const { data } = await axiosNestGa.put(`/academic-calendar/vacancies`, payload);

  return data;
}
