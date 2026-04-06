import {
  NoteUpsertPayload,
  NoteUpsertResponse,
  upsertNote,
} from "@/services/update-or-create-note-release";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpsertNote() {
  const queryClient = useQueryClient();

  return useMutation<NoteUpsertResponse, any, NoteUpsertPayload[]>({
    mutationFn: (payloads: NoteUpsertPayload[]) => upsertNote(payloads), // agora aceita array

    onSuccess: () => {
      // Melhor prática: só invalidar (não precisa refetch imediato)
      queryClient.invalidateQueries({
        queryKey: ["note-releases"],
      });
    },

    onError: (error) => {
      console.error("Erro ao lançar/atualizar nota(s):", error);
    },
  });
}