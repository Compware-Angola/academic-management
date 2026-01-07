import {
  UpdateAvaluationInstallmentPayload,
  updateAvaluationInstallmentService,
} from "@/services/avaliacao/update-avaluation-installments";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutationUpdateParametrosAvaliacoesAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      codigo,
      payload,
    }: {
      codigo: number | string;
      payload: UpdateAvaluationInstallmentPayload;
    }) =>
      updateAvaluationInstallmentService({
        codigo,
        payload,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assessment-parametros-avaliacoes-attendance-list"],
      });
    },
  });
};
