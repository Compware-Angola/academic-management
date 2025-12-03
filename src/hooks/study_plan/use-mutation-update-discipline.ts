// src/hooks/study_plan/use-mutation-update-discipline.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

import { updateDiscipline } from "@/services/study_plan/update-discipline.service";

export function useMutationUpdateDiscipline() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateDiscipline,

    onSuccess: () => {
      toast({
        title: "Disciplina atualizada!",
        description: "Os dados foram salvos com sucesso.",
      });

      queryClient.invalidateQueries({ queryKey: ["disciplines"] });
    },

    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description:
          error?.response?.data?.message ||
          "Não foi possível atualizar a disciplina.",
        variant: "destructive",
      });
    },
  });
}
