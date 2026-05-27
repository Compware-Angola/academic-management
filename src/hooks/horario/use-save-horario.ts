import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

import {
  SaveHorarioPayload,
  saveHorarioService,
} from "@/services/horario/save-horario.service";

export function useSaveHorario(onSuccessReset?: () => void) {
  return useMutation({
    mutationFn: (payload: SaveHorarioPayload) =>
      saveHorarioService(payload),

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
