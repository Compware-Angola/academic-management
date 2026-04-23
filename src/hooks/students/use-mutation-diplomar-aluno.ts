import { diplomarAluno, DiplomarAlunoPayload } from "@/services/students/diplomar-estudante.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useMutationDiplomarAluno() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: DiplomarAlunoPayload) => diplomarAluno(body),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["student-profile"],
      });

      toast.success(data.message);
    },
  });
}