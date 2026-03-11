import { fetchParametrosDocente, ParametrosDocenteResponse } from "@/services/gestao_docente/fetch.gestao.docente.parametro.service";
import { useQuery } from "@tanstack/react-query";

export interface UseDocenteGestaoParams {
  search?: string;
  page?: number;
  limit?: number;
}

export function useParametroDocente(params: Partial<UseDocenteGestaoParams>) {
  const { search, page = 1, limit = 25 } = params;

  return useQuery<ParametrosDocenteResponse, Error>({
    queryKey: ["docente-gestao-parametros", params],
    queryFn: () => fetchParametrosDocente(search, page, limit),
    staleTime: 5 * 60 * 1000,
    enabled: true, 
  });
}