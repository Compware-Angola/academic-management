import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import {
  createPostGraduationVacancy,
  CreatePostGraduationVacancyPayload,
  updatePostGraduationVacancy,
  UpdatePostGraduationVacancyPayload,
} from "@/services/post-graduation/vacancies.service";
import { POST_GRADUATION_VACANCIES_QUERY_KEY } from "./use-query-vacancies";

export function useMutationCreatePostGraduationVacancy() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreatePostGraduationVacancyPayload) =>
      createPostGraduationVacancy(payload),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [POST_GRADUATION_VACANCIES_QUERY_KEY],
      });

      toast({ title: response.message });
    },
    onError: (error: Error) => {
      toast({
        title: "Não foi possível criar a vaga.",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useMutationUpdatePostGraduationVacancy() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      vacancyId,
      payload,
    }: {
      vacancyId: number;
      payload: UpdatePostGraduationVacancyPayload;
    }) => updatePostGraduationVacancy(vacancyId, payload),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: [POST_GRADUATION_VACANCIES_QUERY_KEY],
      });

      toast({ title: response.message });
    },
    onError: (error: Error) => {
      toast({
        title: "Não foi possível atualizar a vaga.",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
