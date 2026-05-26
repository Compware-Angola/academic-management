import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBolsa,
  CreateBolsaBody,
} from "@/services/financas/bolsa/create-bolsa.service";
import { toast } from "sonner";

export function useMutationCreateBolsa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateBolsaBody) => createBolsa(body),
    onSuccess: () => {
      toast.success("Bolsa criada com sucesso");
      queryClient.invalidateQueries({
        queryKey: ["bolsa"],
      });
      queryClient.invalidateQueries({
        queryKey: ["bolsa-estudante"],
      });
      queryClient.invalidateQueries({
        queryKey: ["bolsas-dropdown"],
      });
    },
  });
}
