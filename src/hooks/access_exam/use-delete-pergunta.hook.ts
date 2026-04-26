

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePergunta } from "@/services/access_exam/delete-pergunta.service";

export function useDeletePergunta() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deletePergunta(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["perguntas"] });
        },
        onError: (error) => {
            console.error(error);
        },
    });
}