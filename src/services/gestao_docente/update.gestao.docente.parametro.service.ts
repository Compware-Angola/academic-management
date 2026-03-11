import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface ToggleParametroDocenteResponse {
  message: string;
  state: "SIM" | "NAO";
}

/**
 * Alterna o estado de uma permissão de docente
 * @param codigo Código da permissão/registro
 * @returns Retorna a mensagem e o novo estado
 */
export async function toggleParametroDocente(
  codigo: number
): Promise<ToggleParametroDocenteResponse> {
  const { data } = await axiosNestGa.patch<ToggleParametroDocenteResponse>(
    `docente-gestao/parametros/${codigo}/toggle`
  );

  return data;
}