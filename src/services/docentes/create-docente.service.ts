import { axiosNestGa } from "@/lib/axios-nest-ga";
import {
  CriarDocenteCompletoResponse,
  DocenteWizardState,
} from "./types/gestao-docente/docente-wizard.types";

export async function criarDocenteCompletoService(
  payload: DocenteWizardState,
): Promise<CriarDocenteCompletoResponse> {
  console.table(payload);
  const { data } = await axiosNestGa.post<CriarDocenteCompletoResponse>(
    "/docentes/completo",
    payload,
  );
  return data;
}
