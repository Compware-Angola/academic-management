import { axiosNestGa } from "@/lib/axios-nest-ga";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type UpdateScheduleParamPayload = {
  pk_parametro: number;
  designacao?: string;
  descricao?: string;
  sigla?: string;
  args?: Record<string, unknown> | string;
  obs?: string;
  ordem?: number;
  active_state?: number;
};

export type UpdateScheduleParamResponse = {
  sucesso: number;
  mensagem: string;
};

// ─── HELPER ───────────────────────────────────────────────────────────────────

// Normaliza o args (aceita object, string JSON ou string simples)
function normalizeArgs(args?: Record<string, unknown> | string) {
  if (!args) return args;

  // Se já for object → envia direto
  if (typeof args === "object") return args;

  // Se for string → tenta converter para JSON
  try {
    return JSON.parse(args);
  } catch {
    // Se não for JSON válido → envia como string mesmo
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

  const { data } = await axiosNestGa.patch(
    `/schedule/parametros/${id}`,
    body
  );

  return data;
}