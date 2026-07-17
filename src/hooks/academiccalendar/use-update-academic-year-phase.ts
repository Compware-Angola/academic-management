// hooks/api/academic-calendar/use-update-academic-year-phase.ts

import { updateAcademicYearPhase } from "@/services/academiccalendar/update-academic-year-phase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateAcademicYearPhase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      academicYearId,
      faseLectiva,
    }: {
      academicYearId: number;
      faseLectiva: string;
    }) =>
      updateAcademicYearPhase(academicYearId, {
        faseLectiva,
      }),

    onSuccess: () => {
      toast.success("Fase do ano lectivo actualizada com sucesso.");

      queryClient.invalidateQueries({
        queryKey: ["academic-years"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Erro ao actualizar a fase do ano lectivo.",
      );
    },
  });
}
