import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

import {
  saveHorarioService,
  SaveHorarioPayload,
  SaveHorarioResponse,
} from "@/services/horario/save-horario.service";

export function useSaveHorario(onSuccessReset?: () => void) {
  return useMutation<
    SaveHorarioResponse,
    Error,
    SaveHorarioPayload
  >({
    mutationFn: saveHorarioService,

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

    onError: () => {
      // ⚠️ Isso só cai em falhas reais: timeout, 500, sem internet…
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível comunicar com o servidor.",
      });
    },
  });
}
