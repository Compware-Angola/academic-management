import { axiosNestGa } from "@/lib/axios-nest-ga";

// ─────────────────────────────────────────────
// TÓPICOS
// ─────────────────────────────────────────────

export type TopicosParams = {
  designacao?: string;
  anoLetivoId?: number;
  page?: number;
  limit?: number;
};

export type Topico = {
  id: number;
  designacao: string;
  ano_lectivo_id: number;
  ano_letivo: string;
  arquivo: string;
  created_at: string;
  updated_at: string | null;
};

export type TopicosResponse = {
  data: Topico[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateTopicoPayload = {
  designacao: string;
  anoLetivoId: number;
  arquivo: string;
};

export type UpdateTopicoPayload = {
  designacao?: string;
  arquivo?: string;
};

export type MessageResponse = {
  message: string;
};

export async function fetchTopicos(
  params: TopicosParams
): Promise<TopicosResponse> {
  const { data } = await axiosNestGa.get("/exames-de-acesso/topicos", {
    params,
  });
  return data;
}

export async function fetchTopicoById(id: number): Promise<Topico> {
  const { data } = await axiosNestGa.get(`/exames-de-acesso/topicos/${id}`);
  return data;
}

export async function createTopico(
  payload: CreateTopicoPayload
): Promise<MessageResponse> {
  const { data } = await axiosNestGa.post("/exames-de-acesso/topicos", payload);
  return data;
}

export async function updateTopico(
  id: number,
  payload: UpdateTopicoPayload
): Promise<MessageResponse> {
  const { data } = await axiosNestGa.patch(
    `/exames-de-acesso/topicos/${id}`,
    payload
  );
  return data;
}

export async function deleteTopico(id: number): Promise<MessageResponse> {
  const { data } = await axiosNestGa.delete(`/exames-de-acesso/topicos/${id}`);
  return data;
}
