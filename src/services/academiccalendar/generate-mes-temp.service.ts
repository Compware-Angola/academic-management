// src/services/academiccalendar/generate-mes-temp.service.ts

import { axiosNestGa } from "@/lib/axios-nest-ga";
import { normalizeParam } from "@/util/normalize-param";

export type MesTemp = {
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

/* ---------- PAYLOAD ---------- */

export type GenerateMesTempPayload = {
  anoInicial: number;
  anoFinal: number;
  tipo_candidatura: number;
};

/* ---------- RESPONSE ---------- */

export type GenerateMesTempResponse = MesTemp[];

/* ---------- SERVICE ---------- */
export async function generateMesTempService(
  payload: GenerateMesTempPayload
): Promise<GenerateMesTempResponse> {
  const { anoInicial, anoFinal } = payload;

  // Validação simples (opcional mas recomendada)
  if (!Number.isInteger(anoInicial) || !Number.isInteger(anoFinal)) {
    throw new Error("anoInicial e anoFinal devem ser números inteiros");
  }
  if (anoFinal <= anoInicial) {
    throw new Error("anoFinal deve ser maior que anoInicial");
  }

  const params = {
    anoInicial: normalizeParam(anoInicial),
    anoFinal: normalizeParam(anoFinal),
    tipo_candidatura: payload.tipo_candidatura,
  };

  try {
    const { data } = await axiosNestGa.get<GenerateMesTempResponse>(
      "/academic-calendar/generate-mes-temp",
      { params }
    );

    return data;
  } catch (error: any) {
    console.error("[generateMesTempService] Erro ao gerar meses temporários:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Pode lançar um erro mais amigável ou retornar um fallback conforme tua estratégia
    throw new Error(
      error.response?.data?.message ||
      "Falha ao gerar o calendário de meses temporários. Tente novamente."
    );
  }
}