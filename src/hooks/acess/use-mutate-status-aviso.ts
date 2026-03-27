import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateStatusAvisoService,
  UpdateStatusAvisoPayload,
  UpdateStatusAvisoResponse,
} from "@/services/access/solicitacao/update-status-aviso.service";

export function useMutateStatusAviso() {
  const queryClient = useQueryClient();

  return useMutation<UpdateStatusAvisoResponse, Error, UpdateStatusAvisoPayload>({
    mutationFn: updateStatusAvisoService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["avisos"] });
      queryClient.invalidateQueries({ queryKey: ["avisos-por-grupo"] });
    },
  });
}