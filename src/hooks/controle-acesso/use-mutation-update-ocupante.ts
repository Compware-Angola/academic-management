import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOcupanteCargoService } from "@/services/access/cargos-administrativos/update-ocupante.service";
import { toast } from "@/components/ui/use-toast";

type MutationInput = {
  cargoId: number;
  novoUtilizadorId: number;
};

export function useUpdateOcupanteCargo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cargoId, novoUtilizadorId }: MutationInput) => {
      await updateOcupanteCargoService(cargoId, {
        novoUtilizadorId,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cargos-administrativos"],
      });

      toast({
        title: "Sucesso",
        description: "O ocupante do cargo foi atualizado com sucesso.",
      });
    },

    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o ocupante do cargo.",
      });
    },
  });
}
