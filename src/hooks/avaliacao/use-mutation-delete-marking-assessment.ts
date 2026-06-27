import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { deleteMarkingAssessmentService } from "@/services/avaliacao/delete-marking-assessment";
import { queryClient } from "@/lib/react-query";

export function useMutationDeleteMarkingAssessment() {
  const { toast } = useToast();

  return useMutation<void, Error, number>({
    mutationKey: ["delete-marking-assessment"],
    mutationFn: deleteMarkingAssessmentService,

    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Calendário de prova removido com sucesso.",
      });
      queryClient.invalidateQueries({
        queryKey: ["marking-assessment"],
      });
      queryClient.invalidateQueries({
        queryKey: ["marking-assessment-id"],
      });
    },

    onError: (err: Error) => {
      toast({
        title: "Erro",
        description: err.message || "Erro ao remover calendário de prova.",
        variant: "destructive",
      });
    },
  });
}
