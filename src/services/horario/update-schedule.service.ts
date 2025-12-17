import { AuthStorage } from "@/util/auth-storage";
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
}

export const updateSchedule = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateSchedulePayload;
}) => {
  const userId = AuthStorage.getUser().user_id;
  const response = await axiosNestGa.put(`/schedule/${userId}/${id}`, payload);
  return response.data;
};
