// hooks/use-validate-conciliation.ts

import { useToast } from "@/hooks/use-toast";
import {
  validateConciliation,
  ValidateConciliationPayload,
} from "@/services/financas/conciliacao-divida/validate-conciliacao-divida";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useValidateConciliation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: ValidateConciliationPayload;
    }) => validateConciliation(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["conciliation-details"],
      });

      queryClient.invalidateQueries({
        queryKey: ["conciliacao-dividas"],
      });
      toast({
        title: "Conciliação de Divida",
        description: "Conciliação de Divida actualizada com sucesso",
      });
    },
  });
};
