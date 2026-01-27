import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBolsa,
  CreateBolsaBody,
} from "@/services/financas/bolsa/create-bolsa.service";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

export function useMutationCreateBolsa() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateBolsaBody) => createBolsa(body),

    onSuccess: () => {
      toast({
        title: "Bolsa criada com sucesso",
      });
      queryClient.invalidateQueries({
        queryKey: ["bolsa"],
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: error?.response?.data?.message ?? "Erro ao criar bolsa",
        variant: "destructive",
      });
    },
  });
}
