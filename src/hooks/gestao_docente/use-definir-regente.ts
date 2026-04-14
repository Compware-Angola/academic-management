import { DefinirRegentePayload, DefinirRegenteResponse, DefinirRegenteService } from "@/services/gestao-docente/definer-regente.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDefinirRegente() {
  const queryClient = useQueryClient();

  return useMutation<DefinirRegenteResponse, Error, DefinirRegentePayload>({
    mutationFn: (payload) => DefinirRegenteService(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["docentes-regentes"],
      });
    },
  });
}