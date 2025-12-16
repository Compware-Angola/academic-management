import { axiosApexGa } from "@/lib/axios-apex-ga";
import { axiosNestGa } from "@/lib/axios-nest-ga";
import { AuthStorage } from "@/util/auth-storage";

export type AulaPayload = {
  diaSemana: number;
  ordemTempo: number;
  sala: number;
  docente: number;
  obs: string;
  tipoAula: number;
  hora_inicio: string;
  hora_fim: string;
};

export type SaveHorarioPayload = {
  anoLectivo: number;
  semestre: number;
  periodo: number;
  curso: number;
  unidadeCurricular: number;
  modalidade: number;
  estadoHorario: number;
  designacao: string;
  capacidade: number;
  turma: number;
  apenasPrimeiroAno: number;
  tipoAula: number;
  obs: string;
  aulas: AulaPayload[];
};

export type SaveHorarioResponse = {
  sucesso: number; // 1 | 0
  mensagem: string;
  horarioId?: number;
  designacao?: string;
  aulasCriadas: number;
};

export async function saveHorarioService(
  payload: SaveHorarioPayload
): Promise<SaveHorarioResponse> {
  const userId = AuthStorage.getUser().user_id;
  const { data } = await axiosNestGa.post(`/schedule/${userId}`, payload);

  return data;
}
