import { useMutation, useQueryClient } from "@tanstack/react-query";
import { defineFaculdadeService } from "@/services/access/cargos-administrativos/define-faculdade.service";
import { toast } from "@/components/ui/use-toast";

type MutationInput = {
  tipoCargoId: number;
  utilizadorId: number;
  faculdadeId: number;
  cursoId: number;
};

export function useDefineFaculdade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tipoCargoId,
      utilizadorId,
      faculdadeId,
      cursoId,
    }: MutationInput) => {
      await defineFaculdadeService({
        tipoCargoId,
        utilizadorId,
        faculdadeId,
        cursoId,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cargos-administrativos"],
      });

      toast({
        title: "Sucesso",
        description:
          "O ocupante do cargo da Faculdade foi definido com sucesso.",
      });
    },

    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description:
          "Não foi possível definir o ocupante do cargo da Faculdade.",
      });
    },
  });
}
