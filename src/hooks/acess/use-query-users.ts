import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, FetchUsersParams, ToggleUserResponse, toggleUserStatus, UsersResponse } from "@/services/access/fect-users.service";
export function useUsers(params: FetchUsersParams = {}) {
  return useQuery<UsersResponse, Error>({
    queryKey: ["users", params],
    queryFn: () => fetchUsers(params),
    
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

/**
 * Hook para alternar o estado (ativo/inativo) de um utilizador
 */
export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation<ToggleUserResponse, Error, number>({
    mutationFn: (userId: number) => toggleUserStatus(userId),

    onSuccess: (data) => {
      // Mostra mensagem de sucesso (opcional)
      console.log(data.message);

      // Invalida/refaz a query da lista de utilizadores para atualizar automaticamente
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error) => {
      console.error("Erro ao alterar estado do utilizador:", error);
    },
  });
}

