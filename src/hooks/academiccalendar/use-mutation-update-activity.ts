import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { AxiosError } from "axios";

import { updateActivity } from "@/services/academiccalendar/fetch-create-activity";
export const useMutationActivity = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["atividades"] });
      toast({
        title: "Atualizado",
      });
    },
    onError(error: AxiosError<{ msgresposta: string }>) {
      const message =
        error?.response?.status === 400
          ? error.response.data?.msgresposta
          : "Erro ao atualizar";
      toast({
        title: "Erro",
        description: message,
      });
    },
  });
};
