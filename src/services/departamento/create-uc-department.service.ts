import { axiosNestGa } from "@/lib/axios-nest-ga";

export type CreateUcDepartmentPayload = {
  cursos: {
    codigoCurso: number;
  }[];
  codigoDisciplina: number;
  codigoAnoLectivo: number;
  codigoSemestre: number;
  codigoClasse: number;
  codigoDepartamento: number;
  codigoUtilizador: number;
};

export async function createUcDepartmentService(
  payload: CreateUcDepartmentPayload,
): Promise<void> {
  await axiosNestGa.post("/discipline/departamento", payload);
}
