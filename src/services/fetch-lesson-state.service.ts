import { axiosNestGa } from "@/lib/axios-nest-ga";

export type LessonState = {
    DESIGNACAO: string,
    PK_ESTADO_AGENDAMENTO: number,
}
export async function fetchStateLesson(): Promise<LessonState[]> {
  const { data } = await axiosNestGa.get("/assiduidade/estado-aula");
  return data;
}