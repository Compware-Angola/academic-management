import { getEstadoPautaService } from "@/services/avaliacao/fetch-estado-pauta";
import { useQuery } from "@tanstack/react-query";

export function useQueryEstadoPauta() {
  return useQuery({
    queryKey: ["avaliacao-estado-pauta"],
    queryFn: getEstadoPautaService,
  });
}
