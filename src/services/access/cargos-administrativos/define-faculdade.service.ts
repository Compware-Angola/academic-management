import { axiosNestGa } from "@/lib/axios-nest-ga";

type DefineFaculdadePayload = {
  tipoCargoId: number;
  utilizadorId: number;
  faculdadeId: number;
  cursoId: number;
};

export async function defineFaculdadeService(
  payload: DefineFaculdadePayload
): Promise<void> {
  await axiosNestGa.post("cargos-administrativos/faculdade", payload);
}
