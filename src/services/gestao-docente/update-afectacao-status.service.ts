import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface UpdateAfectacaoStatusPayload {
  status: number;
}

export const updateAfectacaoStatus = async ({
  codigo,
  payload,
}: {
  codigo: number;
  payload: UpdateAfectacaoStatusPayload;
}): Promise<void> => {
  await axiosNestGa.put(`/docente-gestao/afectacao/${codigo}/status`, payload);
};
