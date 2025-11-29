import { axiosApexGa } from "@/lib/axios-apex-ga";
export type Teacher = {
"pk": number,
"nomeAbreviado": string,
"nomeCompleto": string
 }
export async function fetchTeacherByUC(unidadeCurricular:string): Promise<Teacher[]> {
  const { data } = await axiosApexGa.get("Docentes/docentes_horario", {params:{p_uc:unidadeCurricular }});
  return data.docentes ?? [];
}
