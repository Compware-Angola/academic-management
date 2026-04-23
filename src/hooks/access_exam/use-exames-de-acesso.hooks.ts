import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchTopicos,
  fetchTopicoById,
  createTopico,
  updateTopico,
  deleteTopico,

  TopicosParams,
 
  CreateTopicoPayload,
  UpdateTopicoPayload,

} from "@/services/access_exam/topic-exam.service";

import {
 
  fetchPerguntas,
  createPergunta,
  updatePergunta,
  fetchRespostasByPergunta,
  createResposta,
  updateResposta,
  deleteResposta,
  
  PerguntasParams,
  
  CreatePerguntaPayload,
  UpdatePerguntaPayload,
  CreateRespostaPayload,
  UpdateRespostaPayload,
} from "@/services/access_exam/questions.service";
// ─────────────────────────────────────────────
// TÓPICOS — QUERIES
// ─────────────────────────────────────────────

export function useTopicos(
  params: TopicosParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["topicos", params],
    queryFn: () => fetchTopicos(params),
    enabled: options?.enabled ?? true,
  });
}

export function useTopicoById(
  id: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["topicos", id],
    queryFn: () => fetchTopicoById(id),
    enabled: options?.enabled ?? true,
  });
}

// ─────────────────────────────────────────────
// TÓPICOS — MUTATIONS
// ─────────────────────────────────────────────

export function useCreateTopico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTopicoPayload) => createTopico(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topicos"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useUpdateTopico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTopicoPayload }) =>
      updateTopico(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["topicos"] });
      queryClient.invalidateQueries({ queryKey: ["topicos", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useDeleteTopico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTopico(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topicos"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

// ─────────────────────────────────────────────
// PERGUNTAS — QUERIES
// ─────────────────────────────────────────────

export function usePerguntas(
  params: PerguntasParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["perguntas", params],
    queryFn: () => fetchPerguntas(params),
    enabled: options?.enabled ?? true,
  });
}

// ─────────────────────────────────────────────
// PERGUNTAS — MUTATIONS
// ─────────────────────────────────────────────

export function useCreatePergunta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePerguntaPayload) => createPergunta(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perguntas"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useUpdatePergunta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePerguntaPayload }) =>
      updatePergunta(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["perguntas"] });
      queryClient.invalidateQueries({ queryKey: ["respostas", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

// ─────────────────────────────────────────────
// RESPOSTAS — QUERIES
// ─────────────────────────────────────────────

export function useRespostasByPergunta(
  perguntaId: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["respostas", perguntaId],
    queryFn: () => fetchRespostasByPergunta(perguntaId),
    enabled: options?.enabled ?? !!perguntaId,
  });
}

// ─────────────────────────────────────────────
// RESPOSTAS — MUTATIONS
// ─────────────────────────────────────────────

export function useCreateResposta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRespostaPayload) => createResposta(payload),
    onSuccess: (_data, { perguntaId }) => {
      queryClient.invalidateQueries({ queryKey: ["respostas", perguntaId] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useUpdateResposta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateRespostaPayload }) =>
      updateResposta(id, payload),
    onSuccess: (_data, { payload }) => {
      queryClient.invalidateQueries({ queryKey: ["respostas", payload.perguntaId] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useDeleteResposta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, perguntaId }: { id: number; perguntaId: number }) =>
      deleteResposta(id),
    onSuccess: (_data, { perguntaId }) => {
      queryClient.invalidateQueries({ queryKey: ["respostas", perguntaId] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}