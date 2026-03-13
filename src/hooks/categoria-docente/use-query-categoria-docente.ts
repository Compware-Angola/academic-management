import {
  CategoriaDocente,
  fetchCategoriaDocente,
} from "@/services/categoria-docente/fetch-categoria-docente.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryCategoriaDocente() {
  return useQuery<CategoriaDocente[]>({
    queryKey: ["categoria-docente"],
    queryFn: fetchCategoriaDocente,
    staleTime: 1 * 60 * 60 * 1000,
  });
}
