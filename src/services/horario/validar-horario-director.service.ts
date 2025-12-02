import { axiosApexGa } from "@/lib/axios-apex-ga";



export type ValidarHorarioDirectoPayload = {
  p_horario_id: number | string;
};

export async function ValidarHorarioDirectorService(
  payload: ValidarHorarioDirectoPayload,
): Promise<void> {
  const { p_horario_id } = payload;

  await axiosApexGa.put("/horario/Validar" + "?p_horario_id=" + p_horario_id);
}
