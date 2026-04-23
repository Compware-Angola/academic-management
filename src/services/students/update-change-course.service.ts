import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ChangeCoursePayload = {
  PoloId: number;
  matriculaId: number;
  cursoId: number;
  motivo: string;
};

export async function changeStudentCourse(data: ChangeCoursePayload) {
  const response = await axiosNestGa.put(`/students/mudar-curso`, data);

  return response.data;
}
