import { axiosApexGa } from "@/lib/axios-apex-ga";
export type UpdateVagasPayload = { id: number; num_vagas: number };
export async function updateVagas(payload: UpdateVagasPayload) {
  const { data } = await axiosApexGa.put(`auto/fk2_vagas_cursos`, payload);

  return data;
}
