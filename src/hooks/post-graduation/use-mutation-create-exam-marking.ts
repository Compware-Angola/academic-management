import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import {
  createPostGraduationExamMarking,
  CreatePostGraduationExamMarkingPayload,
} from "@/services/post-graduation/create-exam-marking.service";
import { POST_GRADUATION_EXAM_MARKING_OPTIONS_QUERY_KEY } from "./use-query-exam-marking-options";
import { POST_GRADUATION_EXAM_MARKINGS_QUERY_KEY } from "./use-query-exam-markings";

export function useMutationCreateExamMarking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreatePostGraduationExamMarkingPayload) =>
      createPostGraduationExamMarking(payload),
    onSuccess: async (response) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [POST_GRADUATION_EXAM_MARKINGS_QUERY_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: [POST_GRADUATION_EXAM_MARKING_OPTIONS_QUERY_KEY],
        }),
      ]);

      toast({
        title: response.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Nao foi possivel marcar a prova.",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
