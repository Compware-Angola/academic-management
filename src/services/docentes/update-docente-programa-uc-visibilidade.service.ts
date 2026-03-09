import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface UpdateProgramaUCEstadoPayload {
  estado: number;
}

export const updateProgramaUCVisibilidade = async ({
  programaUcId,
  payload,
}: {
  programaUcId: number;
  payload: UpdateProgramaUCEstadoPayload;
}): Promise<void> => {
  await axiosNestGa.put(
    `/docentes/programa-uc/${programaUcId}/visibilidade`,
    payload,
  );
};
