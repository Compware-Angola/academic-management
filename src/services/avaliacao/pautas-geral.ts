import { axiosNestGa } from "@/lib/axios-nest-ga";

export type PautaGeral = {
  obs: string[];
  formula: string[];
  nota1f: string;
  nota2f: string;
  notaEx: string;
  notaRec: string;
  notaPra: string;
  notaOr: string;
  notaOrRec: string;
  notaMel: string;
  notaEE: string;
  notaOEE: string;
  ano: string;
  codigoGradeAluno: number;
  disciplina: string;
  duracao: string;
  gradeCurricula: number;
  matricula: number;
  media: string;
  nome_completo: string;
  num_matricula: string;
  resultado: string;
  semestre: string;
  unidadeCurricular: string;
};

export type PautasGeralParams = {
  anoLectivo: string;
  gradeCurricular?: string;
  horario?: string;
  semestre: string;
};

export type PautasGeralResponse = PautaGeral[];
export async function getPautasGeral(
  params: PautasGeralParams
): Promise<PautasGeralResponse> {
  const response = await axiosNestGa.get<PautasGeralResponse>(
    "/assessment/pautas-geral",
    { params }
  );

  return response.data;
}
