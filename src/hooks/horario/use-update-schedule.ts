import { updateSchedule } from "@/services/horario/update-schedule.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";

export const useUpdateSchedule = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSchedule,

    onSuccess: (data) => {
      if (data.sucesso === 0) {
        toast({
          variant: "destructive",
          title: "Erro ao salvar",
          description: data.mensagem,
        });
        return;
      }

      toast({
        title: "Horário Atualizado",
        description: data.mensagem,
      });
      queryClient.invalidateQueries({
        queryKey: ["schedule", "schedule-details"],
      });
    },

    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível comunicar com o servidor.",
      });
    },
  });
};
