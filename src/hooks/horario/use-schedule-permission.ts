import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSchedulePermission,
  SchedulePermissionPayload,
} from "@/services/horario/schedule-permission.service";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../use-auth";

export function useSchedulePermission() {
  const {
    user: {
      user: { pk_utilizador },
    },
  } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SchedulePermissionPayload) =>
      createSchedulePermission(pk_utilizador, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["schedule-with-permission"],
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
