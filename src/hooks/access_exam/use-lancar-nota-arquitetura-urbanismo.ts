import {
  lancarNotaArquitecturaEUrbanismo,
  LancarNotaArquitecturaPayload,
} from "@/services/access_exam/lancar-nota-arquitetura-urbanismo.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLancarNotaArquitecturaEUrbanismo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: LancarNotaArquitecturaPayload }) =>
      lancarNotaArquitecturaEUrbanismo(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidatos"] });
      queryClient.invalidateQueries({ queryKey: ["resultado-prova"] });
    },

    onError: (error) => {
      console.error(error);
    },
  });
}