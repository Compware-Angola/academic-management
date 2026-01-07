import { useQuery } from "@tanstack/react-query";
import fetchSexo from "@/services/access/referencias/sexo.service";

export function useQuerySexo() {
  return useQuery({
    queryKey: ["sexo"],
    queryFn: fetchSexo,

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}