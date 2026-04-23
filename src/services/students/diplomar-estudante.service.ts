import { axiosNestGa } from "@/lib/axios-nest-ga";

export type DiplomarAlunoPayload = {
  codigoMatricula: number;
  dataConclusao?: string;
  imprimeCartaConclusao?: boolean;
};

export async function diplomarAluno(payload: DiplomarAlunoPayload) {
  const { data } = await axiosNestGa.put(`/students/diplomar`, payload);
  return data;
}