import { fetchAtividade, Atividade } from "@/services/fetch-atividade";
import { useQuery } from "@tanstack/react-query";

export function useQueryAtividades({
  anoLetivoId,
  tipoCandidaturaId,
}: {
  anoLetivoId: string;
  tipoCandidaturaId: string;
}) {
  return useQuery<Atividade[]>({
    queryKey: ["atividades", anoLetivoId, tipoCandidaturaId],
    queryFn: async () => {
      if (!tipoCandidaturaId) return [];
      return fetchAtividade({ anoLetivoId, tipoCandidaturaId });
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!tipoCandidaturaId,
  });
}
