import { axiosNestGa } from "@/lib/axios-nest-ga";

export type ListagemGeralEstudante = {
  numero: number;
  numero_matricula: string | number;
  nome: string;
  tipo_aluno: string;
  ano_lectivo: string;
  sexo: string;
  naturalidade: string;
  necessidade: string;
  faculdade: string;
  curso: string;
  ano_curricular: string | number;
  periodo: string;
};

export type ListagemGeralEstudantesResponse = {
  data: ListagemGeralEstudante[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ListagemGeralEstudantesParams = {
  page: number;
  limit: number;
  anoLectivo?: number;
  faculdade?: number;
  grauAcademico?: number;
  curso?: number;
  anoCurricular?: number;
  periodo?: number;
  nacionalidade?: number;
  necessidade?: number;
  sexo?: number;
  search?: string;
};

export async function ListagemGeralEstudantesService(
  params: ListagemGeralEstudantesParams
): Promise<ListagemGeralEstudantesResponse> {
  const { data } = await axiosNestGa.get<ListagemGeralEstudantesResponse>(
    "/enrollment/listagem-geral-estudantes",
    {
      params: {
        page: params.page,
        limit: params.limit,
        anoLectivo: params.anoLectivo ?? 0,
        faculdade: params.faculdade ?? 0,
        grauAcademico: params.grauAcademico ?? 0,
        curso: params.curso ?? 0,
        anoCurricular: params.anoCurricular ?? 0,
        periodo: params.periodo ?? 0,
        nacionalidade: params.nacionalidade ?? 0,
        necessidade: params.necessidade ?? 0,
        sexo: params.sexo ?? 0,
        search: params.search ?? "",
      },
    }
  );

  return data;
}