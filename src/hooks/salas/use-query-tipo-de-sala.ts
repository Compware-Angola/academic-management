import { fetchTipoDeSala,TipoDeSala } from "@/services/salas/fetch-tipo-de-sala";

import { useQuery } from "@tanstack/react-query";


export function useQueryTipoDeSalas() {


  return useQuery<TipoDeSala[]>({
    queryKey: ["tipo-de-salas"],
    queryFn: () => fetchTipoDeSala( ),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
