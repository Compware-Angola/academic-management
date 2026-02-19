import { CreateMesTempPayload, CreateMesTempResponse, createMesTempService } from "@/services/academiccalendar/create-mes-temp.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useMutationCreateMesTemp() {
  const queryClient = useQueryClient();

  return useMutation<CreateMesTempResponse, Error, CreateMesTempPayload>({
    mutationFn: (payload) => createMesTempService(payload),

    onSuccess: () => {
      // Se quiser invalidar algum cache relacionado
      queryClient.invalidateQueries({
        queryKey: ["generate-mes-temp"],
      });
    },
  });
}
