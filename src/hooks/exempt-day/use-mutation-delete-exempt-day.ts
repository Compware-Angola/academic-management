import { deleteExemptDay } from "@/services/exempt-days/delete-exempt-day.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useMutationDeleteExemptDay() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codigo: number) =>
      deleteExemptDay(codigo),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["exempt-days"],
      });

      toast({
        title: "Dia isento removido com sucesso.",
      });
    },

    onError: (error: any) => {
      toast({
        title: "Erro ao remover dia isento",
        description:
          error?.message ||
          "Erro inesperado ao tentar remover.",
        variant: "destructive",
      });
    },
  });
}
