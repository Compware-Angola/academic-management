import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

import {
  SaveHorarioPayload,
  saveHorarioService,
} from "@/services/horario/save-horario.service";
import { useAuth } from "../use-auth";

export function useSaveHorario(onSuccessReset?: () => void) {
  const {
    user: {
      user: { pk_utilizador },
    },
  } = useAuth();
  return useMutation({
    mutationFn: (payload: SaveHorarioPayload) =>
      saveHorarioService(payload, pk_utilizador),

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
        title: "Horário salvo",
        description: data.mensagem,
      });

      onSuccessReset?.();
    },

    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: err?.message,
      });
    },
  });
}
