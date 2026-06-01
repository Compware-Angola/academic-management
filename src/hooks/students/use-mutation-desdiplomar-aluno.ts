import {
  desdiplomarAluno,
  DesdiplomarAlunoPayload,
} from "@/services/students/desdiplomar-estudante.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useMutationDesdiplomarAluno() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: DesdiplomarAlunoPayload) => desdiplomarAluno(body),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["student-detail"],
      });

      toast.success(data.message);
    },
  });
}
