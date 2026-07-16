import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchCandidatos,
  FilterCandidatoParams,
  validarDocumentoUniversidadePublica,
} from "@/services/access_exam/fetch-candidatos.service";

export function useCandidatos(
  filters: FilterCandidatoParams = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["candidatos", filters],
    queryFn: () => fetchCandidatos(filters),
    enabled: options?.enabled ?? true,
  });
}

export function useValidarDocumentoUniversidadePublica() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => validarDocumentoUniversidadePublica(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidatos"] }); // ajusta para a tua queryKey real
    },
  });
}
