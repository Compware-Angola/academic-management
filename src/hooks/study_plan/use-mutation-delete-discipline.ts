// src/hooks/study_plan/use-mutation-delete-discipline.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { deleteDiscipline } from "@/services/teachers/study_plan/delete-discipline.service";

export function useMutationDeleteDiscipline() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (codigo: string | number) => deleteDiscipline(codigo),

    onSuccess: () => {
      toast({
        title: "Disciplina removida!",
        description: "A disciplina foi eliminada com sucesso.",
      });

      // Atualiza automaticamente a tabela após deletar
      queryClient.invalidateQueries({ queryKey: ["disciplines"] });
    },

    onError: (error: any) => {
      toast({
        title: "Erro ao eliminar",
        description:
          error?.response?.data?.message ||
          "Não foi possível eliminar a disciplina.",
        variant: "destructive",
      });
    },
  });
}
