import { axiosNestGa } from "@/lib/axios-nest-ga";



// ─────────────────────────────────────────────
// PERGUNTAS
// ─────────────────────────────────────────────
export type MessageResponse = {
  message: string;
};
export type PerguntasParams = {
  descricao?: string;
  disciplinaId?: number;
  page?: number;
  limit?: number;
};

export type Pergunta = {
  id: number;
  descricao: string;
  tipo_pergunta_id: number;
  tipo_pergunta: string;
  disciplina_id: number;
  disciplina: string;
  cotacao: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PerguntasResponse = {
  data: Pergunta[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreatePerguntaPayload = {
  descricao: string;
  disciplinaId: number;
  tipoPerguntaId: number;
  cotacao: number;
};

export type UpdatePerguntaPayload = {
  descricao?: string;
  disciplinaId?: number;
  tipoPerguntaId?: number;
  cotacao?: number;
};

export async function fetchPerguntas(
  params: PerguntasParams
): Promise<PerguntasResponse> {
  const { data } = await axiosNestGa.get("/exames-de-acesso/perguntas", {
    params,
  });
  return data;
}

export async function createPergunta(
  payload: CreatePerguntaPayload
): Promise<MessageResponse> {
  const { data } = await axiosNestGa.post(
    "/exames-de-acesso/perguntas",
    payload
  );
  return data;
}

export async function updatePergunta(
  id: number,
  payload: UpdatePerguntaPayload
): Promise<MessageResponse> {
  const { data } = await axiosNestGa.patch(
    `/exames-de-acesso/perguntas/${id}`,
    payload
  );
  return data;
}

// ─────────────────────────────────────────────
// RESPOSTAS
// ─────────────────────────────────────────────

export type Resposta = {
  id: number;
  descricao: string;
  tipo_resposta_id: number;
  valor_resposta: string;
  pergunta_id: number;
  created_at: string;
  updated_at: string;
};

export type CreateRespostaPayload = {
  descricao: string;
  tipoRespostaId: number;
  perguntaId: number;
};

export type UpdateRespostaPayload = {
  descricao?: string;
  tipoRespostaId?: number;
  perguntaId?: number;
};

export async function fetchRespostasByPergunta(
  perguntaId: number
): Promise<Resposta[]> {
  const { data } = await axiosNestGa.get(
    `/exames-de-acesso/perguntas/${perguntaId}/respostas`
  );
  return data;
}

export async function createResposta(
  payload: CreateRespostaPayload
): Promise<MessageResponse> {
  const { data } = await axiosNestGa.post(
    "/exames-de-acesso/perguntas/respostas",
    payload
  );
  return data;
}

export async function updateResposta(
  id: number,
  payload: UpdateRespostaPayload
): Promise<MessageResponse> {
  const { data } = await axiosNestGa.patch(
    `/exames-de-acesso/perguntas/respostas/${id}`,
    payload
  );
  return data;
}

export async function deleteResposta(id: number): Promise<MessageResponse> {
  const { data } = await axiosNestGa.delete(
    `/exames-de-acesso/perguntas/respostas/${id}`
  );
  return data;
}