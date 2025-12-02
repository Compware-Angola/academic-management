
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

import { updateDiponibilidadeService } from "@/services/horario/disponibilidade-schedule.service";

export const useMutationDisponibilidadeHorario= () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateDiponibilidadeService,


    onSuccess: () => {
  
      queryClient.invalidateQueries({
        queryKey: ["horarios-existentes"],
      });

      toast({
        title: "Upadate!",
        description: "O horário foi Atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao Atualizar",
        description:
          error?.response?.data?.message ||
          "Ocorreu um problema ao tentar Atualizar o horário.",
        variant: "destructive",
      });
    },
  });
};