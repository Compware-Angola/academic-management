import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  vincularOrientadorTemaService, } from "@/services/defesa-tfc/vicular-orientador-tema.service";
import { toast } from "sonner"; 

export function useMutationVincularOrientadorAluno() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vincularOrientadorTemaService,
    onSuccess: (response) => {
      toast.success(response.message || "Vínculo realizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["orientadores-tfc"] });
      queryClient.invalidateQueries({ queryKey: ["vinculos"] });
    },
  });
}