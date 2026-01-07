import { useQuery } from "@tanstack/react-query";
import fetchTipoDocumento from "@/services/access/referencias/tipo-documentos.service";

export function useQueryTipoDocumento() {
  return useQuery({
    queryKey: ["tipo-documento"],
    queryFn: fetchTipoDocumento,

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}