// src/hooks/assessment/useAssessmentPermission.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { createAssessmentPermission } from "@/services/avaliacao/create-permission-launch.service";
import {
  createCalendar,
  CreateCalendarPayload,
} from "@/services/avaliacao/create-calendario-prova";
import { useAuth } from "../use-auth";

export function useMutationCreateCalendar() {
  const {
    user: {
      user: { nome, pk_utilizador },
    },
  } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCalendarPayload) =>
      createCalendar(
        { codigoUtilizador: pk_utilizador, descUtilizador: nome },
        payload
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["marking-assessment"],
      });

      toast({
        title: "Calendário  criado com sucesso",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar calendário",
        description: error?.response?.data?.message || error?.message,
        variant: "destructive",
      });
    },
  });
}
