import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface UpdateAvaluationInstallmentPayload {
  descricao?: string;
  observacao?: string;
  observacao2?: number;
  observacao3?: string;
  descricaoParametro?: string;
  modulo?: string;
  activo?: number;
}

export const updateAvaluationInstallmentService = async ({
  codigo,
  payload,
}: {
  codigo: number | string;
  payload: UpdateAvaluationInstallmentPayload;
}) => {
  const response = await axiosNestGa.put(
    `/assessment/parametros-avaliacoes-attendance-list/${codigo}`,
    payload
  );

  return response.data;
};
