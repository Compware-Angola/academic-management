import { axiosNestGa } from "@/lib/axios-nest-ga";

/* -------------------------------- PAYLOAD -------------------------------- */
export type GetRegistrationDetailsBySchedulePayload = {
  scheduleId: number; // obrigatório
};

/* -------------------------------- RESPONSE -------------------------------- */
export type RegistrationDetailItem = {
  codigo_grade_aluno: number;
  numero_de_matricula: number;
  nome_completo: string;
  codigo_horario: number;
  designacao: string;
  unidadecurricularid: number;
  unidadecurricular: string;
  curso: string;
  ano: string;
  capacidade: number;
  reservado: string;
  semestre: string;
  estado: string;
  estadocor: string | null;
  estadoid: number;
  disponibilidade: string;
  criadopor: string;
  atualizadopor: string | null;
  dataultimaatualizacao: string;
  datacriacao: string;
};

export type GetRegistrationDetailsByScheduleResponse = RegistrationDetailItem[]

/* -------------------------------- SERVICE -------------------------------- */
export async function getRegistrationDetailsByScheduleService(
  payload: GetRegistrationDetailsBySchedulePayload
): Promise<GetRegistrationDetailsByScheduleResponse> {
  const { scheduleId } = payload;

  const { data } =
    await axiosNestGa.get<GetRegistrationDetailsByScheduleResponse>(
      `/schedule/registration-by-schedule/details/${scheduleId}`
    );

  return data;
}
