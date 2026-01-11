import { useMutation, useQueryClient } from "@tanstack/react-query";
import { defineReitoriaService } from "@/services/access/cargos-administrativos/define-reitoria.service";
import { toast } from "@/components/ui/use-toast";

type MutationInput = {
  tipoCargoId: number;
  utilizadorId: number;
};

export function useDefineReitoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tipoCargoId, utilizadorId }: MutationInput) => {
      await defineReitoriaService({
        tipoCargoId,
        utilizadorId,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cargos-administrativos"],
      });

      toast({
        title: "Sucesso",
        description:
          "O ocupante do cargo da Reitoria foi definido com sucesso.",
      });
    },

    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível definir o ocupante da Reitoria.",
      });
    },
  });
}
