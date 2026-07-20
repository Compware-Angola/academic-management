import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

import {
  createPostGraduationSummary,
  CreatePostGraduationSummaryPayload,
  updatePostGraduationSummary,
  UpdatePostGraduationSummaryPayload,
  validatePostGraduationSummary,
} from "@/services/post-graduation/summaries.service";
import { POST_GRADUATION_SUMMARIES_QUERY_KEY } from "./use-query-summaries";
import { POST_GRADUATION_SUMMARY_GENERAL_CONTROL_QUERY_KEY } from "./use-query-summary-general-control";
import { POST_GRADUATION_SUMMARY_SCHEDULED_CLASSES_QUERY_KEY } from "./use-query-summary-scheduled-classes";

function useInvalidatePostGraduationSummaryQueries() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: [POST_GRADUATION_SUMMARY_SCHEDULED_CLASSES_QUERY_KEY],
    });
    queryClient.invalidateQueries({
      queryKey: [POST_GRADUATION_SUMMARIES_QUERY_KEY],
    });
    queryClient.invalidateQueries({
      queryKey: [POST_GRADUATION_SUMMARY_GENERAL_CONTROL_QUERY_KEY],
    });
  };
}

export function useMutationCreatePostGraduationSummary() {
  const invalidateSummaryQueries = useInvalidatePostGraduationSummaryQueries();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreatePostGraduationSummaryPayload) =>
      createPostGraduationSummary(payload),
    onSuccess: invalidateSummaryQueries,
    onError: (error: any) => {
      toast({
        title: "Erro ao criar sumário",
        description:
          error?.message || "Ocorreu um problema ao tentar criar o sumário.",
        variant: "destructive",
      });
    },
  });
}

export function useMutationUpdatePostGraduationSummary() {
  const invalidateSummaryQueries = useInvalidatePostGraduationSummaryQueries();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      summaryId,
      payload,
    }: {
      summaryId: number;
      payload: UpdatePostGraduationSummaryPayload;
    }) => updatePostGraduationSummary(summaryId, payload),
    onSuccess: invalidateSummaryQueries,
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar sumário",
        description:
          error?.message ||
          "Ocorreu um problema ao tentar atualizar o sumário.",
        variant: "destructive",
      });
    },
  });
}

export function useMutationValidatePostGraduationSummary() {
  const invalidateSummaryQueries = useInvalidatePostGraduationSummaryQueries();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      summaryId,
      statusId,
    }: {
      summaryId: number;
      statusId: number;
    }) => validatePostGraduationSummary(summaryId, statusId),
    onSuccess: () => {
      toast({
        title: "Sumário validado",
        description: "O sumário foi validado com sucesso.",
      });
      invalidateSummaryQueries();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao validar sumário",
        description:
          error?.message ||
          "Ocorreu um problema ao tentar validar o sumário.",
        variant: "destructive",
      });
    },
  });
}
