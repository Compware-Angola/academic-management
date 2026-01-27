// hooks/access/use-grant-user-access.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { grantUserAccess } from "@/services/access/grant-user-access.service";

type GrantUserAccessParams = {
  utilizadorId: number;
  acessoId: number;
};

export function useGrantUserAccess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ utilizadorId, acessoId }: GrantUserAccessParams) =>
      grantUserAccess(utilizadorId, acessoId),

    onSuccess: (_, variables) => {
      // Invalida a lista de acessos desse utilizador específico
      queryClient.invalidateQueries({
        queryKey: ["user-groups", variables.utilizadorId],
      });

 
    },

  
    onError: (error) => {
      // toast.error("Erro ao conceder acesso");
      console.error(error);
    },
  });
}