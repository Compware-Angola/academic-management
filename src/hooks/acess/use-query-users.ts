
import { fetchUsers, User } from "@/services/access/fect-users.service";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para buscar a lista de utilizadores (UMA)
 * Uso: const { data: users, isLoading, error } = useUsers();
 */
export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ["users"],               // chave única para o cache
    queryFn: fetchUsers,               // função que faz o request
    staleTime: 1000 * 60 * 10,         // 10 minutos (ajusta conforme necessidade)

    refetchOnWindowFocus: false,       // evita refetch desnecessário
    retry: 2,                          // tenta novamente 2 vezes em caso de falha
  });
}