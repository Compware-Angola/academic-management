import {
  AcessosUtilizadorResponse,
  fetchAcessosUtilizador,
} from "@/services/access/fetch-accesses-user.service";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../use-auth";

export function useAcessosUtilizador() {
  const {
    user: {
      user: { pk_utilizador },
    },
  } = useAuth();

  return useQuery<AcessosUtilizadorResponse[]>({
    queryKey: ["utilizador-acessos"],
    queryFn: () => fetchAcessosUtilizador(pk_utilizador),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
}
