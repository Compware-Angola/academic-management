import { axiosNestGa } from "@/lib/axios-nest-ga";

export type DesdiplomarAlunoPayload = {
  codigoMatricula: number;
  motivo?: string;
};

export async function desdiplomarAluno(payload: DesdiplomarAlunoPayload) {
  const { data } = await axiosNestGa.put(`/students/desdiplomar`, payload);
  return data;
}
