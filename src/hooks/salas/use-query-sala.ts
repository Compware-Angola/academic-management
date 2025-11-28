import { fetchSalas, Sala } from "@/services/salas/fetch-sala";
import { useQuery } from "@tanstack/react-query";

type Props = {
  tipoSala?: string;
  estado?: string;
}
export function useQuerySalas(params?: Props) {


  return useQuery<Sala[]>({
    queryKey: ["salas", params?.tipoSala ?? "all", params?.estado],
    queryFn: () => fetchSalas({tipoSala: params?.tipoSala, estado: params?.estado} ),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
