import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ListStudentNotesPayload = {
  anoLectivo: number;
  codigoMatricula: number;
  page?: number;
  limit?: number;
};

export type StudentNoteItem = {
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

export type ListStudentNotesResponse = {
  data: StudentNoteItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getStudentNotesService(
  payload: ListStudentNotesPayload,
): Promise<ListStudentNotesResponse> {
  const { anoLectivo, codigoMatricula, page = 1, limit = 25 } = payload;

  const { data } = await axiosNestGa.get<ListStudentNotesResponse>(
    "/students/notes",
    {
      params: {
        anoLectivo,
        codigoMatricula,
        page,
        limit,
      },
    },
  );

  return data;
}
