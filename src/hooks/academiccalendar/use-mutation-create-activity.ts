// src/hooks/mutations/use-mutation-criar-atividade.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { fetchCreateActivity } from "@/services/academiccalendar/fetch-create-activity";
import { AxiosError } from "axios";

export function useMutationfetchCreateActivity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: fetchCreateActivity,
    onSuccess: () => {
      // Invalida a lista de atividades para forçar o refetch
      queryClient.invalidateQueries({ queryKey: ["atividades"] });
      // Opcional: invalida queries específicas com filtros
      // queryClient.invalidateQueries({ queryKey: ["atividades", { anoLetivoId, tipoCandidaturaId }] });
    },
    onError: (error: any) => {
      if (error instanceof AxiosError) {
        toast({
          title: "Erro ao criar atividade",
          description:
            error.response.data?.msgresposta ||
            "Verifique os dados e tente novamente. domingos",
          variant: "destructive",
        });
      }
    },
  });
}
