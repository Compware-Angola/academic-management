import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPreInscrito,
  deletePreInscrito,
  fetchPreInscritos,
  PreInscritoFilters,
  updatePreInscrito,
} from "@/services/pre-inscritos/pre-inscritos.service";

export function usePreInscritos(filters: PreInscritoFilters = {}) {
  return useQuery({
    queryKey: ["pre-inscritos", filters],
    queryFn: () => fetchPreInscritos(filters),
  });
}

export function useCreatePreInscrito() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPreInscrito,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pre-inscritos"] });
    },
  });
}

export function useUpdatePreInscrito() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Parameters<typeof updatePreInscrito>[1];
    }) => updatePreInscrito(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pre-inscritos"] });
    },
  });
}

export function useDeletePreInscrito() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePreInscrito,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pre-inscritos"] });
    },
  });
}
