import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ListarDiplomadosPayload = {
  anoLectivo: number;
  codigoCurso?: number;
  genero?: "todos" | "Masculino" | "Feminino";
  tipoCandidatura?: number;
  search?: string;
  page?: number;
  limit?: number;
};

export type EstudanteDiplomado = {
  matricula: number;
  nome: string;
  bilhete: string;
  data_nascimento: string;
  codigo_curso: number;
  curso: string;
  codigo_tipo_candidatura: number;
  tipo_candidatura: string;
  data_matricula: string;
  data_conclusao: string;
  genero: string;
  idade: number;
  media: number;
  tipo_aluno: string;
};

export type ListarDiplomadosResponse = {
  success: boolean;
  data: EstudanteDiplomado[];
  total: number;
  page: number;
  totalPages: number;
};

export async function listarEstudantesDiplomados(
  params: ListarDiplomadosPayload,
): Promise<ListarDiplomadosResponse> {
  const { data } = await axiosNestGa.get("/students/diplomados", {
    params,
  });

  return data;
}