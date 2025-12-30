import { axiosNestGa } from "@/lib/axios-nest-ga";

export type GetHistoryNoteReleasePayload = {
  codigoAnoLectivo: number;
  codigoMatricula: number;
  codigo_grade_curricular_aluno: number;
};

export type HistoryNoteItem = {
  matricula: number;
  nome: string;
  grade: string;
  nota_lancada: number;
  datalancada: string;
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
