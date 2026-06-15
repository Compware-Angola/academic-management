import { fetchPosGraduationCandidates, PosGraduationCandidatesParams } from "@/services/post-graduation/candidates.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useQueryCandidatesPosGraduation = (params: PosGraduationCandidatesParams) => {
  return useQuery({
    queryKey: ["pos-graduation", "candidates", params],
    queryFn: () => fetchPosGraduationCandidates(params),
    enabled: Boolean(params.codigoTipoCandidatura),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}