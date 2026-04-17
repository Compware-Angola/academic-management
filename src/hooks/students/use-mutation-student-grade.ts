import { deleteGradeCurricularAluno, DeleteGradeCurricularAlunoPayload, restoreGradeCurricularAluno, RestoreGradeCurricularAlunoPayload } from "@/services/students/students.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export function useMutationDeleteGradeCurricularAluno() {
 
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: DeleteGradeCurricularAlunoPayload) => deleteGradeCurricularAluno(body),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["student-disciplinas"],
      });
      toast.success(data.message);

    },

   
  }

);
}

export function useMutationRestoreGradeCurricularAluno() {
 
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: RestoreGradeCurricularAlunoPayload) => restoreGradeCurricularAluno(body),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["student-disciplinas"],
      });
      toast.success(data.message);

    },

   
  }

);
}