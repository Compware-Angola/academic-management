import { axiosApexGa } from "@/lib/axios-apex-ga";

/**
 * DELETE /ga/disciplines/:disciplina
 */
export async function deleteDiscipline(codigo: string | number) {
  const response = await axiosApexGa.delete(`/ga/disciplines/${codigo}`);

  return response.data;
}
