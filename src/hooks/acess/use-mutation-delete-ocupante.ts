import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/use-toast";
import { deleteOcupanteCargoService } from "@/services/access/cargos-administrativos/delete-ocupante.service";

export function useDeleteOcupanteCargo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cargoId: number) => {
      await deleteOcupanteCargoService(cargoId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cargos-administrativos"],
      });

      toast({
        title: "Sucesso",
        description: "O ocupante do cargo foi removido com sucesso.",
      });
    },

    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover o ocupante do cargo.",
      });
    },
  });
}
