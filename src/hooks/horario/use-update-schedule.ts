import {
  updateSchedule,
  UpdateSchedulePayload,
} from "@/services/horario/update-schedule.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";

import { useAuth } from "../use-auth";

export const useUpdateSchedule = () => {
  const {
    user: {
      user: { pk_utilizador },
    },
  } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateSchedulePayload;
    }) => updateSchedule(pk_utilizador, { id, payload }),

    onSuccess: (data) => {
      if (data.sucesso === 0) {
        toast({
          variant: "destructive",
          title: "Erro ao salvar",
          description: data.mensagem,
        });
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["schedule"],
      });
      queryClient.invalidateQueries({
        queryKey: ["schedule-details"],
      });
      queryClient.invalidateQueries({
        queryKey: ["horarios-existentes"],
      });
      toast({
        title: "Horário Atualizado",
        description: data.mensagem,
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
