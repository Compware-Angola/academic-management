
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";
import { deleteScheduleService } from "@/services/horario/delete-schedule.service";

export const useMutationDeletarHorario = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteScheduleService,


    onSuccess: () => {
  
      queryClient.invalidateQueries({
        queryKey: ["horarios-existentes"],
      });

      toast({
        title: "Excluído!",
        description: "O horário foi removido com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir",
        description:
          error?.response?.data?.message ||
          "Ocorreu um problema ao tentar excluir o horário. Tem Alunos Incritos",
        variant: "destructive",
      });
    },
  });
};