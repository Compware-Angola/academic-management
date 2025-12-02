import { axiosNestGa } from "@/lib/axios-nest-ga";

export type UpdateExemptDayPayload = {
  codigo: number;
  observacao: string;
  data_inicio: string; // yyyy-MM-dd
  data_fim: string;    // yyyy-MM-dd
  estado: number;     // 1 | 0
};

export async function updateExemptDay(
  payload: UpdateExemptDayPayload
): Promise<void> {

  await axiosNestGa.put(
    `exempt-days/${payload.codigo}`,
    {
      dataInicio: payload.data_inicio,
      dataFim: payload.data_fim,
      observacao: payload.observacao,
      estado: payload.estado,
    }
  );
}
