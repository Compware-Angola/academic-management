import { fetchModalidade,Modalidade } from "@/services/modalidade/fetch-modalidade";
import { useQuery } from "@tanstack/react-query";

export function useQueryModalidade() {
  return useQuery<Modalidade[], Error>({
    queryKey: ["modalidades"],
    queryFn: fetchModalidade,
    staleTime: 1000 * 60 * 60,
    retry: 2,
  });
}
