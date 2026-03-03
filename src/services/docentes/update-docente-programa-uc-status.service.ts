import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface UpdateProgramaUCEstadoPayload {
  estado: number;
}

export const updateProgramaUCEstado = async ({
  programaUcId,
  payload,
}: {
  programaUcId: number;
  payload: UpdateProgramaUCEstadoPayload;
}): Promise<void> => {
  await axiosNestGa.put(
    `/docentes/programa-uc/estado/${programaUcId}`,
    payload,
  );
};
