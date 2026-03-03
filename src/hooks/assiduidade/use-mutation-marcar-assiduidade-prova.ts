import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MarcarAulaPayload,
  MarcarAulaResponse,
  marcarAulaAssiduidadeProvaService,
} from "@/services/assiduidade/marcar-assiduidade.service";

export const useMutationMarcarProva = () => {
  const queryClient = useQueryClient();

  return useMutation<MarcarAulaResponse, Error, MarcarAulaPayload>({
    mutationFn: marcarAulaAssiduidadeProvaService,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prova-assiduidade"] });
    },

    retry: 1,
  });
};