import { fetchPrazos } from "@/services/prazos/fetchPrazos";
import { useQuery } from "@tanstack/react-query";

type PrazosParams = {
  anoLetivoId?: string;
  tipoPrazoId?: string;
  tipoCandidaturaId?: string;
};

export function useQueryPrazos(params: PrazosParams) {
  const enabled =
    !!params.anoLetivoId && !!params.tipoPrazoId && !!params.tipoCandidaturaId;

  return useQuery({
    queryKey: ["prazos", params],
    queryFn: () =>
      fetchPrazos({
        anoLetivoId: params.anoLetivoId!,
        tipoPrazoId: params.tipoPrazoId!,
        tipoCandidaturaId: params.tipoCandidaturaId,
      }),
    enabled,
  });
}
