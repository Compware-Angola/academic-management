import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GetMonthlyInstallmentsPayload = {
  semestre?: number;
  anoLectivo: number;
};

export type MonthlyInstallment = {
  id: number;
  designacao: string;
  isencao: number;
  ordem_mes: number;
  ano_lectivo: number;
  prestacao: number;
  activo: number;
  activo_posgraduacao: number;
  data_limite: string;
  data_inicial: string;
  data_final: string;
  data_final_desconto: string | null;
  semestre: number;
  semestre_posgraduacao: number;
};

export type GetMonthlyInstallmentsResponse = MonthlyInstallment[];

export async function getMonthlyInstallmentsService(
  payload: GetMonthlyInstallmentsPayload
): Promise<GetMonthlyInstallmentsResponse> {
  const { semestre, anoLectivo } = payload;

  const { data } = await axiosNestGa.get<GetMonthlyInstallmentsResponse>(
    "/academic-calendar/meses-prestacoes",
    {
      params: {
        semestre,
        anoLectivo,
      },
    }
  );

  return data;
}
