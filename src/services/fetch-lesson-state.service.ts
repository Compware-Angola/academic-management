import { axiosNestGa } from "@/lib/axios-nest-ga";

export type LessonState = {
    designacao: string,
    codigo: number,
}
export async function fetchStateLesson(): Promise<LessonState[]> {
  const { data } = await axiosNestGa.get("/assiduidade/estado-aula");
  return data.docentes ?? [];
}