import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  UpdateMarkingAssessmentPayload,
  updateMarkingAssessmentService,
} from "@/services/avaliacao/update-marking-assessment.service";

export function useMutateUpdateMarkingAssessment() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation<void, Error, UpdateMarkingAssessmentPayload>({
    mutationKey: ["update-marking-assessment"],
    mutationFn: updateMarkingAssessmentService,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["marking-assessment"],
      });
      queryClient.invalidateQueries({
        queryKey: ["marking-assessment-id"],
      });
      toast({
        title: "Sucesso",
        description: "Marcação de prova actualizada com sucesso.",
      });
    },

    onError: (err: Error) => {
      toast({
        title: "Erro",
        description: err.message || "Erro ao actualizar marcação de prova.",
        variant: "destructive",
      });
    },
  });
}
