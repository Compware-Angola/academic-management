import { axiosNestFinance } from "@/lib/axios-nest-finance";

export interface ValidateConciliationPayload {
  decisao: "APROVADO" | "REJEITADO";
  descricaoValidacao: string;
}

export const validateConciliation = async (
  id: number,
  payload: ValidateConciliationPayload,
): Promise<void> => {
  await axiosNestFinance.patch(`/conciliacao-dividas/${id}/validar`, payload);
};
