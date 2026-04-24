import { axiosNestGa } from "@/lib/axios-nest-ga";

// ─────────────────────────────────────────────
// TIPOS DE PERGUNTA
// ─────────────────────────────────────────────

export type TipoPergunta = {
  designacao: string;
  codigo: number;
};

export type TiposPerguntaParams = {
  page?: number;
  limit?: number;
};

export type TiposPerguntaResponse = {
  data: TipoPergunta[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function fetchTiposPergunta(
  params?: TiposPerguntaParams
): Promise<TiposPerguntaResponse> {
  const { data } = await axiosNestGa.get(
    "/exames-de-acesso/perguntas/tipos-pergunta",
    { params }
  );
  return data;
}

// ─────────────────────────────────────────────
// DISCIPLINAS
// ─────────────────────────────────────────────

export type Disciplina = {
  id: number;
  designacao: string;
};

export type DisciplinasParams = {
  page?: number;
  limit?: number;
};

export type DisciplinasResponse = {
  data: Disciplina[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function fetchDisciplinas(
  params?: DisciplinasParams
): Promise<DisciplinasResponse> {
  const { data } = await axiosNestGa.get(
    "/exames-de-acesso/perguntas/disciplinas",
    { params }
  );
  return data;
}