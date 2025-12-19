import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { saveExemptDays } from "@/services/exempt-days/save-exempt-day.service";

export function useSaveExemptDay() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveExemptDays,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["exempt-days"],
      });

      toast({
        title: "Dia isento criado com sucesso.",
      });
    },

    onError: (error: any) => {
      toast({
        title: "Erro ao criar dia isento",
        description: error?.message || "Erro inesperado ao tentar criar.",
        variant: "destructive",
      });
    },
  });
}
