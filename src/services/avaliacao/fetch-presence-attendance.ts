import { axiosNestGa } from "@/lib/axios-nest-ga";

export type PresencaEstudante = {
  numero_matricula: number;
  nome: string;
  primeira_frequencia: number;
  segunda_frequencia: number;
  exame: number;
  meses_obrigatorios: number;
  meses_pagos: number;
  eh_bolseiro: number;
};

export type PresencaQuery = {
  anoLectivo: number;
  horarioPk: number;
  situacao_financeira: number;
  tipo_avaliacao: number;
};

export async function getPresenceAttendanceService(
  params: PresencaQuery
): Promise<PresencaEstudante[]> {
  const { data } = await axiosNestGa.get<PresencaEstudante[]>(
    "/assessment/list-presence-attendance",
    { params }
  );

  return data;
}
