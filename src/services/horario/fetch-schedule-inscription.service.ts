import { axiosNestGa } from "@/lib/axios-nest-ga";

/* -------------------------------- PAYLOAD -------------------------------- */
export type GetRegistrationBySchedulePayload = {
  anoLectivo: number;          // obrigatório
  semestre?: number;           // opcional
  periodo?: number;            // opcional
  curso?: number;              // opcional
  anoCurricular?: number;      // opcional
  unidadeCurricular?: number;  // opcional
  estado?: number;             // opcional
  afetacaoDocente?: number;
  page?: number;
  limit?: number;
};

/* -------------------------------- RESPONSE -------------------------------- */

export type RegistrationScheduleItem = {
  codigo: number;
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
  total_alunos: number;
};

export type GetRegistrationByScheduleResponse = {
  data: RegistrationScheduleItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* -------------------------------- SERVICE -------------------------------- */

export async function getRegistrationByScheduleService(
  payload: GetRegistrationBySchedulePayload
): Promise<GetRegistrationByScheduleResponse> {
  const {
    anoLectivo,
    semestre,
    periodo,
    curso,
    anoCurricular,
    unidadeCurricular,
    afetacaoDocente,
    estado,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestGa.get<GetRegistrationByScheduleResponse>(
    "/schedule/registration-by-schedule",
    {
      params: {
        anoLectivo,
        semestre,
        periodo,
        curso,
        anoCurricular,
        unidadeCurricular,
        afetacaoDocente,
        estado,
        page,
        limit,
      },
    }
  );

  return data;
}
