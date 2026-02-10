import { axiosNestGa } from "@/lib/axios-nest-ga";

export type MesPago = {
  mes_temp_id: number;
  factura: number;
};
export type PresencaApiItem = {
  numero_matricula: number;
  nome: string;
  is_bolseiro: number;
  mes_pago: number;
  periodo: string;
  curso: string;
  classe: string;
};

export type PresencaEstudante = {
  data: PresencaApiItem[];
  page: number;
  limit: number;
  hasNextPage: boolean;
};

export type PresencaQuery = {
  anoLectivo: number;
  horarioPk: number;
  semestre: number;
  situacao_financeira: number;
  codigoMatricula: number;
  nome: string;
  page?: number;
  limit?: number;
};

export async function getPresenceAttendanceService(
  params: PresencaQuery,
): Promise<PresencaEstudante> {
  const { data } = await axiosNestGa.get<PresencaEstudante>(
    "/assessment/list-presence-attendance",
    { params },
  );

  return data;
}
