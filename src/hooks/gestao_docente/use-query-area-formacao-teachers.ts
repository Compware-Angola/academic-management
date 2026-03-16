import { getAreaFormacaoDocenteService, ListAreaFormacaoDocenteResponse } from "@/services/gestao-docente/fetch-area-formacao-docente.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryAreaFormacaoDocentes() {
  
  return useQuery<ListAreaFormacaoDocenteResponse>({
    queryKey: [
      "area_formacao-docente"],
    queryFn: () => getAreaFormacaoDocenteService(),
  });
}