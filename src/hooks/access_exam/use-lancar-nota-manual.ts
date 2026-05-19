import {
  lancarNotaManual,
  LancarNotaManualPayload,
} from "@/services/access_exam/lancar-nota-manual.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLancarNotaManual() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: LancarNotaManualPayload;
    }) => lancarNotaManual(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidatos"] });
      queryClient.invalidateQueries({ queryKey: ["resultado-prova"] });
      queryClient.invalidateQueries({ queryKey: ["resultados-finais"] });
      queryClient.invalidateQueries({ queryKey: ["candidatos-admitidos"] });
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
