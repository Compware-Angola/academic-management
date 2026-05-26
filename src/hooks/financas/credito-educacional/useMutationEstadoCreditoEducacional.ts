import { switchEstadoCreditoEducacionalService } from "@/services/financas/credito-educacional/estado-credito-educacional.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useMutationEstadoCreditoEducacional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: switchEstadoCreditoEducacionalService,
    onSuccess: () => {
      toast("Estado alterado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["bolsa-estudante"] });
    },
  });
}
