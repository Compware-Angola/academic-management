import {
  ApproveCandidatePayload,
  candidateDecisionApi,
  fetchPosGraduationCandidateDocuments,
  fetchPosGraduationCandidates,
  PosGraduationCandidatesParams,
  RejectCandidatePayload,
} from "@/services/post-graduation/candidates.service";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useQueryCandidatesPosGraduation = (
  params: PosGraduationCandidatesParams,
) => {
  return useQuery({
    queryKey: ["pos-graduation", "candidates", params],
    queryFn: () => fetchPosGraduationCandidates(params),
    enabled: Boolean(params.codigoTipoCandidatura),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useQueryCandidateDocuments = (codigoPreinscricao?: number) => {
  return useQuery({
    queryKey: ["pos-graduation", "candidate-documents", codigoPreinscricao],
    queryFn: () => fetchPosGraduationCandidateDocuments(codigoPreinscricao!),
    enabled: Boolean(codigoPreinscricao),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export function useApproveCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApproveCandidatePayload) =>
      candidateDecisionApi.approve(payload),
    onSuccess: () => {
      toast.success("Candidato aprovado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["pos-graduation", "candidates"],
      });
      queryClient.invalidateQueries({ queryKey: ["candidate"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Erro ao aprovar candidato.",
      );
    },
  });
}

export function useRejectCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RejectCandidatePayload) =>
      candidateDecisionApi.reject(payload),
    onSuccess: () => {
      toast.success("Candidato rejeitado.");
      queryClient.invalidateQueries({
        queryKey: ["pos-graduation", "candidates"],
      });
      queryClient.invalidateQueries({ queryKey: ["candidate"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Erro ao rejeitar candidato.",
      );
    },
  });
}
