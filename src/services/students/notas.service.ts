import { axiosNestGa } from "@/lib/axios-nest-ga";

type NotaDisciplina = {
  codigo: number;
  disciplina: string;
  nota: number;
  horas_teoricas: number;
  horas_teorico_praticas: number;
  horas_praticas: number;
  duracao_nome: string;
  ano_lectivo_nome: string;
  semestre: number;
  classe: number;
};

export interface NotasServiceParams {
  codigoMatricula: number;
  anoMin: number;
  anoMax: number;
}

export async function getNotasService({
  codigoMatricula,
  anoMin,
  anoMax,
}: NotasServiceParams) {
  const response = await axiosNestGa.get<NotaDisciplina[]>(
    `/students/notas-certificado?matriculaId=${codigoMatricula}&anoMin=${anoMin}&anoMax=${anoMax}`,
  );
  return response.data;
}
