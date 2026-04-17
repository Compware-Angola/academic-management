import { updateGradeCurricularHorarioAluno, UpdateGradeCurricularHorarioAlunoPayload } from "@/services/students/students.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useMutationUpdateGradeCurricularHorarioAluno() {
 
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateGradeCurricularHorarioAlunoPayload) => updateGradeCurricularHorarioAluno(body),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["student-disciplinas"],
      });
      toast.success(data.message);

    },

   
  }

);
}
