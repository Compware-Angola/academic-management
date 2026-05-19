import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProva,
  deleteProva,
  fetchProvaById,
  fetchProvas,
  updateProva,
  CreateProvaPayload,
  ProvasParams,
  UpdateProvaPayload,
} from "@/services/access_exam/provas.service";

export function useProvas(params: ProvasParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["provas", params],
    queryFn: () => fetchProvas(params),
    enabled: options?.enabled ?? true,
  });
}

export function useProvaById(id?: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["provas", id],
    queryFn: () => fetchProvaById(id as number),
    enabled: (options?.enabled ?? true) && !!id,
  });
}

export function useCreateProva() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProvaPayload) => createProva(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provas"] });
    },
  });
}

export function useUpdateProva() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProvaPayload }) =>
      updateProva(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["provas"] });
      queryClient.invalidateQueries({ queryKey: ["provas", id] });
    },
  });
}

export function useDeleteProva() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProva(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provas"] });
    },
  });
}
