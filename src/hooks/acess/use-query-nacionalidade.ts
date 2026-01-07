import { useQuery } from "@tanstack/react-query";
import fetchNacionalidade from "@/services/access/referencias/nacionalidade.service";

export function useQueryNacionalidade() {
  return useQuery({
    queryKey: ["nacionalidade"],
    queryFn: fetchNacionalidade,

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}