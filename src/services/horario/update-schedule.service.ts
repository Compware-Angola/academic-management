import { AulaPayload } from "./save-horario.service";
import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface UpdateSchedulePayload {
  anoLectivo: number;
  semestre: number;
  periodo: number;
  curso: number;
  unidadeCurricular: number;
  modalidade: number;
  estadoHorario: number;
  designacao: string;
  capacidade: number;
  turma?: number;
  apenasPrimeiroAno?: number;
  tipoAula?: number;
  obs?: string;
  aulas: AulaPayload[];
  sala: number;
}

export const updateSchedule = async (
  userId: number,
  {
    id,
    payload,
  }: {
    id: number;
    payload: UpdateSchedulePayload;
  },
) => {
  const response = await axiosNestGa.put(`/schedule/${userId}/${id}`, payload);
  return response.data;
};
