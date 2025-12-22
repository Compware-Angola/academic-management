import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GetHistoryNoteReleasePayload = {
  codigoAnoLectivo: number; // ex: 22
  codigoMatricula: number; // ex: 54312
  codigo_grade_curricular_aluno: number; // ex: 1336896
};

export type HistoryNoteItem = {
  matricula: number;
  nome: string; // "Catarina Morena Lopes Fernando"
  grade: string; // "Biologia Celular e Molecular"
  nota_lancada: number; // ex: 11
  datalancada: string; // ISO string "2025-02-11T17:39:54.000Z"
  utilizador: string | null;
};

export type GetHistoryNoteReleaseResponse = HistoryNoteItem[];

export async function getHistoryNoteReleaseService(
  payload: GetHistoryNoteReleasePayload
): Promise<GetHistoryNoteReleaseResponse> {
  const { codigoAnoLectivo, codigoMatricula, codigo_grade_curricular_aluno } =
    payload;

  const { data } = await axiosNestGa.get<GetHistoryNoteReleaseResponse>(
    "/assessment/get-history-note-release",
    {
      params: {
        codigoAnoLectivo,
        codigoMatricula,
        codigo_grade_curricular_aluno,
      },
    }
  );

  return data;
}
