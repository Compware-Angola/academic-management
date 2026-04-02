
import { axiosNestGa } from "@/lib/axios-nest-ga";

export async function deletarDocenteSubstitutoService(id: number): Promise<void> {
  await axiosNestGa.delete(`/docente-substituto/${id}`);
}