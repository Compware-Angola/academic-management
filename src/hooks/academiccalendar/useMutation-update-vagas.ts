import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { AxiosError } from "axios";
import {
  updateVagas,
  UpdateVagasPayload,
} from "@/services/academiccalendar/update-vagas";
export const useMutationUpdateVagas = () => {
  const { toast } = useToast();
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateVagasPayload) => updateVagas(payload),
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: ["academic-year-vacancies"],
      });
      toast({
        title: "Atualizado",
        description: "Vagas atualizado",
      });
    },
    onError(error: AxiosError<{ msgresposta: string }>) {
      const message =
        error?.response?.status === 400
          ? error.response.data?.msgresposta
          : "Erro ao atualizar a vaga";
      toast({
        title: "Erro",
        description: message,
      });
    },
  });
};
