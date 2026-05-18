import { axiosNestGa } from "@/lib/axios-nest-ga";

export type MessageResponse = {
  message: string;
};

export type ProvaRef = {
  id: number;
};

export type ProvaResumo = {
  data_realizacao: string | null;
  senha_prova: string;
  sala_id: number | null;
  tipo_prova_id: number | null;
  disciplina_id: number | null;
  ano_lectivo_id: number;
  ano_letivo: string;
  user_id: number;
  usuario: string;
  created_at: string;
  updated_at: string | null;
  status_: number;
  duracao: number;
  periodo_id: number | null;
  texto: string | null;
  descricao: string;
  perguntas: ProvaRef[];
  disciplinas: ProvaRef[];
  cursos: ProvaRef[];
  id: number;
};

export type ProvaPerguntaDetalhe = {
  id: number;
  pergunta_texto: string;
  tipo_pergunta_id: number;
  tipo_pergunta: string;
  disciplina_id: number;
  disciplina: string;
  pergunta_created_at: string;
  pergunta_updated_at: string | null;
  respostas: {
    id: number;
    resposta_texto: string;
    tipo_resposta_id: number;
    tipo_resposta: string;
    resposta_created_at: string;
    resposta_updated_at: string | null;
  }[];
};

export type ProvaDetalhe = Omit<
  ProvaResumo,
  "perguntas" | "disciplinas" | "cursos"
> & {
  perguntas: ProvaPerguntaDetalhe[];
  disciplinas: {
    id: number;
    designacao: string;
  }[];
  cursos: {
    codigo: number;
    designacao: string;
  }[];
};

export type ProvasParams = {
  id?: number;
  userId?: number;
  anoLetivoId?: number;
  dataRealizacao?: string;
  descricao?: string;
  page?: number;
  limit?: number;
};

export type ProvasResponse = {
  data: ProvaResumo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateProvaPayload = {
  descricao: string;
  senhaProva: string;
  anoLetivoId: number;
  userId: number;
  duracao: number;
  texto?: string;
  perguntas?: ProvaRef[];
  disciplinas?: ProvaRef[];
  cursos?: ProvaRef[];
};

export type UpdateProvaPayload = {
  senhaProva?: string;
  anoLetivoId?: number;
  duracao?: number;
  descricao?: string;
  perguntas?: ProvaRef[];
  cursos?: ProvaRef[];
  disciplinas?: ProvaRef[];
};

export async function fetchProvas(
  params: ProvasParams
): Promise<ProvasResponse> {
  const { data } = await axiosNestGa.get("/exames-de-acesso/provas", {
    params,
  });
  return data;
}

export async function fetchProvaById(id: number): Promise<ProvaDetalhe> {
  const { data } = await axiosNestGa.get(`/exames-de-acesso/provas/${id}`);
  return data;
}

export async function createProva(
  payload: CreateProvaPayload
): Promise<MessageResponse> {
  const { data } = await axiosNestGa.post("/exames-de-acesso/provas", payload);
  return data;
}

export async function updateProva(
  id: number,
  payload: UpdateProvaPayload
): Promise<MessageResponse> {
  const { data } = await axiosNestGa.patch(
    `/exames-de-acesso/provas/${id}`,
    payload
  );
  return data;
}

export async function deleteProva(id: number): Promise<MessageResponse> {
  const { data } = await axiosNestGa.delete(`/exames-de-acesso/provas/${id}`);
  return data;
}
