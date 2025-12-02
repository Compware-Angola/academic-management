import { axiosApexGa } from "@/lib/axios-apex-ga";



export type UpdateSchedulePayload = {
  p_horario_id: number | string;
};

export async function updateDiponibilidadeService(
  payload: UpdateSchedulePayload,
): Promise<void> {
  const { p_horario_id } = payload;

  await axiosApexGa.put("/horario/disponibilidade?p_horario_id=" + p_horario_id);
}