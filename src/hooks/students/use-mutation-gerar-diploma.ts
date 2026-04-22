import { gerarDiploma, GerarDiplomaPayload } from "@/services/students/fetch-gerar-diploma.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


export function useMutationGerarDiploma() {
  return useMutation({
    mutationFn: (body: GerarDiplomaPayload) => gerarDiploma(body),

    onSuccess: (data) => {
      toast.success(data.message);
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Erro ao gerar diploma";

      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
}