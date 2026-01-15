// src/hooks/acess/use-mutation-delete-access.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { deleteGroupAccess } from "@/services/access/fecth-access.service";
import { useAuth } from "../use-auth";

export function useMutationDeleteAccess() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: { grupoId: number; utilizadorId: number }) =>
      deleteGroupAccess(data),
    onSuccess: (_, acessoCodigo) => {
      toast({
        title: "Permissão removida",
        description: `Acesso foi removido com sucesso.`,
      });

      // Invalida todas as queries de acessos de grupos (ou só a do grupo atual se souberes o groupId)
      queryClient.invalidateQueries({ queryKey: ["group-accesses"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover permissão",
        description:
          error?.response?.data?.message ||
          "Ocorreu um erro ao tentar remover o acesso.",
        variant: "destructive",
      });
    },
  });
}
