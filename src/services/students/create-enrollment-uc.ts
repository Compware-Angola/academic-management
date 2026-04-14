import { axiosNestGa } from "@/lib/axios-nest-ga";

export type CreateEnrollmentUCBody = {
  codigoAnoLectivo: number;
  codigoMatricula: number;
  codigoGrades: number[];
  epoca: number;
  observacao?: string;
};

export async function createEnrollmentUC(body: CreateEnrollmentUCBody) {
  const { data } = await axiosNestGa.post("/students/enrollment/uc", body);
  return data;
}
