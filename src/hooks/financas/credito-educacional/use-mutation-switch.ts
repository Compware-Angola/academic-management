import { useMutation } from "@tanstack/react-query";

import {
  toggleContractEstado,
  type ToggleContractEstadoResponse,
} from "@/services/financas/credito-educacional/institutional-contract/contract.service";

import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";

interface ToggleContractEstadoParams {
  id: string;
  estado: string;
}

export function useToggleContractEstado() {
  return useMutation<
    ToggleContractEstadoResponse,
    any,
    ToggleContractEstadoParams
  >({
    mutationFn: ({ id }) => toggleContractEstado(id),

    onSuccess: (response) => {
      toast.success(
        response.message ||
          "Estado do Contrato de crédito educacional Actualizado com sucesso",
      );

      queryClient.invalidateQueries({
        queryKey: ["institutional-contracts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["contract-estatisticas"],
      });
    },

    onError: (error: any) => {
      if (error?.statusCode === 409) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao actualizar estado do contrato");
      }
    },
  });
}
