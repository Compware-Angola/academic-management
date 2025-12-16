import { axiosNestGa } from "@/lib/axios-nest-ga";
import { AuthStorage } from "@/util/auth-storage";

interface RestaurarHorarioParams {
  codigo: number;
}

export async function restaurarHorarioService({
  codigo,
}: RestaurarHorarioParams) {
  const utilizadorId = AuthStorage.getUser().user_id;
  const { data } = await axiosNestGa.patch(
    `/schedule/${codigo}/restaurar/${utilizadorId}`
  );

  return data;
}
