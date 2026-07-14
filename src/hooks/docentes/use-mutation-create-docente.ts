import { criarDocenteCompletoService } from "@/services/docentes/create-docente.service";
import { DocenteWizardState } from "@/services/docentes/types/gestao-docente/docente-wizard.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useMutationCreateDocente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DocenteWizardState) =>
      criarDocenteCompletoService(payload),
    onSuccess: (data) => {
      toast.success(`Docente cadastrado com sucesso (${data.username})`);
      queryClient.invalidateQueries({ queryKey: ["docentes"] });
      queryClient.invalidateQueries({ queryKey: ["docentes-list"] });
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ??
        "Erro ao cadastrar docente. Tente novamente.";
      toast.error(msg);
    },
  });
}
