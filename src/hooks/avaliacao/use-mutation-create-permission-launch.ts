// src/hooks/assessment/useAssessmentPermission.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  AssessmentPermissionPayload,
  createAssessmentPermission,
} from "@/services/avaliacao/create-permission-launch.service";
import { useAuth } from "../use-auth";

export function useMutationCreatePermissionLaunch() {
  const {
    user: {
      user: { pk_utilizador },
    },
  } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssessmentPermissionPayload) =>
      createAssessmentPermission(pk_utilizador, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["assessment-permissions"],
      });

      toast({
        title: "Permissão criada com sucesso",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar permissão",
        description: error?.response?.data?.message || error?.message,
        variant: "destructive",
      });
    },
  });
}
