import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MarcarAulaPayload,
  MarcarAulaResponse,
  marcarAulaAssiduidadeService,
} from "@/services/assiduidade/marcar-assiduidade.service";

export const useMutationMarcarAula = () => {
  const queryClient = useQueryClient();

  return useMutation<MarcarAulaResponse, Error, MarcarAulaPayload>({
    mutationFn: marcarAulaAssiduidadeService,

    onSuccess: () => {
  
      queryClient.invalidateQueries({ queryKey: ["filtro-assiduidade"] });
      queryClient.invalidateQueries({ queryKey: ["filtro-assiduidade-campo"] });
    },

    retry: 1,
  });
};