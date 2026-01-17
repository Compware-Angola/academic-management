import { useQuery } from "@tanstack/react-query";
import {
  FetchInstituicaoParams,
  listInstituicao,
  ListInstituicaoResponse,
} from "@/services/finance/listar-todas-instituicao.service";

export function useListInstituicao(params: FetchInstituicaoParams = {}) {
  const { instituicao, nif } = params;

  return useQuery<ListInstituicaoResponse>({
    queryKey: [
      "instituicao-todas",
      instituicao,
      nif,
    ],
    queryFn: () =>
      listInstituicao({
        instituicao,
        nif,
      }),
    staleTime: 0, // IMPORTANTE para pesquisa
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}
