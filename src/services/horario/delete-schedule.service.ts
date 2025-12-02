import { axiosApexGa } from "@/lib/axios-apex-ga";



export type DeleteSchedulePayload = {
  p_horario_id: number | string;
};

export async function deleteScheduleService(
  payload: DeleteSchedulePayload,
): Promise<void> {
  const { p_horario_id } = payload;

  await axiosApexGa.delete("/horario/eliminar", {
    params: {
      p_horario_id,
    },
  });
}