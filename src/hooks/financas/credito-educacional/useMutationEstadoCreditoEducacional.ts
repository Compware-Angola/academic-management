import { switchEstadoCreditoEducacionalService, toggleInstituicaoPagouService } from "@/services/financas/credito-educacional/estado-credito-educacional.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useMutationEstadoCreditoEducacional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: switchEstadoCreditoEducacionalService,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["bolsa-estudante"] });
      queryClient.invalidateQueries({ queryKey: ["student-info-bolsa"] });
    },
  });
}


// useMutationToggleInstituicaoPagou

export function useMutationToggleInstituicaoPagou() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { codigo: number }) => toggleInstituicaoPagouService(data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["bolsa-estudante"] });
      queryClient.invalidateQueries({ queryKey: ["student-info-bolsa"] });
    },
  });
}

