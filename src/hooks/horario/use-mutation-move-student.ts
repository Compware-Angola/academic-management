import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  MoveStudentsPayload,
  moveStudentsService,
} from "@/services/horario/save-move-schedule.service";

/* =========================
 * Hook
 * ========================= */

export function useMutationMoveStudents(userId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: MoveStudentsPayload) =>
      moveStudentsService(userId, data),

    onSuccess: () => {
      toast({
        title: "Estudantes movidos com sucesso",
      });

      // Atualiza dados relacionados aos horários
      queryClient.invalidateQueries({
        queryKey: ["registration-details-by-schedule"],
      });
    },

    onError: (error: any) => {
      toast({
        title: "Erro ao movimentar estudante",
        description:
          error?.message ||
          "Ocorreu um problema ao tentar movimentar os estudantes.",
        variant: "destructive",
      });
    },
  });
}
