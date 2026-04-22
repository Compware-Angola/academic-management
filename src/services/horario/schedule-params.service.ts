import { axiosNestGa } from "@/lib/axios-nest-ga";

/* ---------- PAYLOAD ---------- */
export type GetScheduleParamsPayload = {
  tipoParametro: number; // ex: 1
  search?: string;       // ex: "Expressão"
  curso?: number;        // ex: 15
  page?: number;
  limit?: number;
};

/* ---------- RESPONSE ---------- */
export type ScheduleParamItem = {
  pk_parametro: number;
  designacao: string;
  descricao: string;
  sigla: string;
  args:any
  obs: string | null;
  ordem: number;
  active_state: number;
};

export type GetScheduleParamsResponse = {
  success: boolean;
  data: ScheduleParamItem[];
  page: number;
  limit: number;
  hasNextPage: boolean;
};

/* ---------- SERVICE ---------- */
export async function getScheduleParamsService(
  payload: GetScheduleParamsPayload,
): Promise<GetScheduleParamsResponse> {
  const {
    tipoParametro,
    search,
    curso,
    page = 1,
    limit = 25,
  } = payload;

  const { data } = await axiosNestGa.get<GetScheduleParamsResponse>(
    "/schedule/params",
    {
      params: {
        tipoParametro,
        search,
        curso,
        page,
        limit,
      },
    },
  );

  return data;
}