import { restaurarHorarioService } from "@/services/horario/restore-horario.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";

export function useRestaurarHorario() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restaurarHorarioService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["horarios-eliminados"],
      });
      queryClient.invalidateQueries({
        queryKey: ["schedule"],
      });
      toast({
        description: "Horário restaurado com sucesso",
      });
    },
    onError: () => {
      toast({
        description: "Erro ao restaurar horário",
        variant: "destructive",
      });
    },
  });
}
