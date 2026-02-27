import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPrazo } from "@/services/prazos/createPrazo";
import { toast } from "sonner";

export function useCreatePrazo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPrazo,
    onSuccess: () => {
      toast.success("Prazo criado com sucesso!", {
        id: "create-prazo-success",
      });
      queryClient.invalidateQueries({ queryKey: ["prazos"] });
    },
    onError: () => {
      toast.error("Erro ao criar prazo", { id: "create-prazo-error" });
    },
  });
}
