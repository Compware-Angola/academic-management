import {
  NoteUpsertPayload,
  NoteUpsertResponse,
  upsertNote,
} from "@/services/update-or-create-note-release";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpsertNote() {
  const queryClient = useQueryClient();

  return useMutation<NoteUpsertResponse, any, NoteUpsertPayload>({
    mutationFn: (payload: NoteUpsertPayload) => upsertNote(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["note-releases"] });
   
      queryClient.refetchQueries({ queryKey: ["note-releases"] });
    },
    onError: (error) => {
      console.error("Erro ao lançar/atualizar nota:", error);
    },
  });
}