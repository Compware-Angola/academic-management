import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import {
  CreateEnrollmentUCBody,
  createEnrollmentUC,
} from "@/services/students/create-enrollment-uc";

export function useMutationCreateEnrollmentUC() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateEnrollmentUCBody) => createEnrollmentUC(body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendent-uc"],
      });
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title:
          error?.response?.data?.message ||
          error?.message ||
          "Erro ao criar inscrição de UC",
        variant: "destructive",
      });
    },
  });
}
