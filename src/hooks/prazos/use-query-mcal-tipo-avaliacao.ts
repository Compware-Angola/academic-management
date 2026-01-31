import {
  fetchMCALTipoAvaliacao,
  MCALTipoAvaliacao,
} from "@/services/prazos/fetch-tipo-mcal-avaliacao";
import { useQuery } from "@tanstack/react-query";

export function useQueryMCALTipoAvaliacao() {
  return useQuery<MCALTipoAvaliacao[], Error>({
    queryKey: ["mcal-tipo-avaliacao"],
    queryFn: fetchMCALTipoAvaliacao,
    staleTime: 5 * 60 * 1000,
  });
}
