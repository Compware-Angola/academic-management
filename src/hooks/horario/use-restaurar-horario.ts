import {
  restaurarHorarioService,
  RestaurarHorarioParams,
} from "@/services/horario/restore-horario.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { useAuth } from "../use-auth";

export function useRestaurarHorario() {
  const {
    user: {
      user: { pk_utilizador },
    },
  } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RestaurarHorarioParams) =>
      restaurarHorarioService(pk_utilizador, payload),
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
