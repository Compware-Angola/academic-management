import { fetchTiposPrazo } from "@/services/prazos/fetch-tipo-prazo";
import { useQuery } from "@tanstack/react-query";

export function useQueryTiposPrazos() {
  return useQuery({
    queryKey: ["tipo-prazos"],
    queryFn: fetchTiposPrazo,
  });
}
