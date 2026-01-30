import { axiosNestGa } from "@/lib/axios-nest-ga";

export type MesPago = {
  mes_temp_id: number;
  factura: number;
};
export type PresencaApiItem = {
  numero_matricula: number;
  nome: string;
  is_bolseiro: number;
  mes_pago: MesPago[];
};

export type PresencaEstudante = {
  data: PresencaApiItem[];
  prestacao: number;
};

export type PresencaQuery = {
  anoLectivo: number;
  horarioPk: number;
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
