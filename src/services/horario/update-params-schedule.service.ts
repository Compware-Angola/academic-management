import { axiosNestGa } from "@/lib/axios-nest-ga";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type UpdateScheduleParamPayload = {
  pk_parametro: number;
  designacao?: string;
  descricao?: string;
  sigla?: string;
  args?: Record<string, unknown>[] | Record<string, unknown> | string;
  obs?: string;
  ordem?: number;
  active_state?: number;
};

export type UpdateScheduleParamResponse = {
  success: boolean;
  message: string;
  data: {
    pkParametro: number;
    designacao: string;
    descricao: string;
    sigla: string;
    args: unknown;
    obs: string | null;
    ordem: number;
    activeState: number;
  };
};

// ─── HELPER ───────────────────────────────────────────────────────────────────

function normalizeArgs(
  args?: Record<string, unknown>[] | Record<string, unknown> | string
) {
  if (!args) return args;
  if (typeof args === "object") return args;
  try {
    return JSON.parse(args);
  } catch {
    return args;
  }
}

// ─── SERVICE ──────────────────────────────────────────────────────────────────

export async function updateScheduleParamService(
  id: number,
  payload: UpdateScheduleParamPayload
): Promise<UpdateScheduleParamResponse> {
  const body = {
    ...payload,
    args: normalizeArgs(payload.args),
  };

  const { data } = await axiosNestGa.patch(`/schedule/parametros/${id}`, body);
  return data;
}