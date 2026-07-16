import { updateAcademicYearParamsState } from "@/services/academiccalendar/update-academic-year-params-state";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { AxiosError } from "axios";
export const useMutationUpdateAcademicYearState = () => {
  const { toast } = useToast();
  const query = useQueryClient();
  return useMutation({
    mutationFn: ({ codigoAno, estado }: { codigoAno: number; estado: 0 | 1 }) =>
      updateAcademicYearParamsState(codigoAno, { estado }),
    onSuccess: (_, { codigoAno }) => {
      query.invalidateQueries({
        queryKey: ["academic-year-params"],

      });
      query.invalidateQueries({
        queryKey: ["anosLetivos"],

      });
      toast({
        title: "Atualizado",
        description: "Estado parâmetro anualizado",
      });
    },
    onError(error: AxiosError<{ msgresposta: string }>) {
      const message =
        error?.response?.status === 400
          ? error.response.data?.msgresposta
          : "Erro ao atualizar estado do parâmetro";
      toast({
        title: "Erro",
        description: message,
      });
    },
  });
};
