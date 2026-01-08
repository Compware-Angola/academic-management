
import { useQuery } from "@tanstack/react-query";
import {
  ListarSolicitacoesPayload,
  listarSolicitacoesService,
} from "@/services/access/solicitacao/fetch-solicitacao.service";

function cleanFilters<T extends Record<string, unknown>>(
  filters: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "all"
    )
  ) as Partial<T>;
}

export const useQueryListarSolicitacoes = (
  filters: ListarSolicitacoesPayload
) => {
  const sanitizedFilters = cleanFilters(filters);

  return useQuery({
    queryKey: ["solicitacoes", sanitizedFilters],
    queryFn: () => listarSolicitacoesService(sanitizedFilters),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
