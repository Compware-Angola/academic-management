import { axiosApexGa } from "@/lib/axios-apex-ga";

export type CreateUcDepartmentPayload = {
  cursos: {
    codigoCurso: number;
  }[];

  codigo_disciplina: number;
  codigo_ano_lectivo: number;
  codigo_semestre: number;
  codigo_classe: number;
  codigo_curso: number;
  codigo_departamento: number;
  codigo_utilizador: number;
};

export async function createUcDepartmentService(
  payload: CreateUcDepartmentPayload
): Promise<void> {
  await axiosApexGa.post("ga/curriculum-unit/department", payload);
}
