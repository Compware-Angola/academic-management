import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addUCToPlan,
  getGradeCurricular,
  getGradeCurricular2,
  GradeCurricularPayload,
  GradeCurricularResponse,
  toggleStatusGradeCurricular,
} from "@/services/fetch-gradeCurricularService";
import { toast } from "sonner";

export function useGradeCurricular({
  anoLectivo,
  classe,
  curso,
  estado,
  limit,
  page,
}: GradeCurricularPayload) {
  return useQuery<GradeCurricularResponse, Error>({
    queryKey: [
      "grade-curricular",
      anoLectivo,
      classe,
      curso,
      estado,
      limit,
      page,
    ],
    queryFn: () =>
      getGradeCurricular({
        anoLectivo,
        classe,
        curso,
        estado,
        limit,
        page,
      }),
    enabled: !!anoLectivo,
    //  && !!curso
    staleTime: 1000 * 60 * 10,
  });
}
export const useAddUCToPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUCToPlan,
    onSuccess: () => {
      // Invalida todas as queries de grade curricular
      queryClient.invalidateQueries({ queryKey: ["grade-curricular"] });
    },
  });
};

export function useGradeCurricular2({
  classe,
  curso,
  semestre,
  estado,
  limit,
  page,
}: Omit<GradeCurricularPayload, "anoLectivo">) {
  return useQuery<GradeCurricularResponse, Error>({
    queryKey: [
      "grade-curricular",
      classe,
      curso,
      semestre,
      estado,
      limit,
      page,
    ],
    queryFn: () =>
      getGradeCurricular2({
        classe,
        semestre,
        curso,
        estado,
        limit,
        page,
      }),
    enabled: !!curso,
    staleTime: 1000 * 60 * 10,
  });
}

export const useToggleStatusGradeCurricular = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleStatusGradeCurricular,
    onSuccess: () => {
      // Invalida todas as queries de grade curricular
      queryClient.invalidateQueries({ queryKey: ["grade-curricular"] });
      toast.success("Estado actualizado!");
    },
  });
};
