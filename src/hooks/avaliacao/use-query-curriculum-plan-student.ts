import {
  GetCurricularPlanStudentPayload,
  GetCurricularPlanStudentResponse,
  getCurricularPlanStudentService,
} from "@/services/avaliacao/fetch-curriculum-student-plan";
import { useQuery } from "@tanstack/react-query";

export const useQueryCurricularPlanStudent = (
  filters: GetCurricularPlanStudentPayload,
  options?: {
    enabled?: boolean; // permite sobrescrever o enabled automático
  }
) => {
  const { anoLectivo, matricula } = filters;

  // Só faz a chamada se os campos obrigatórios estiverem preenchidos
  const enabled =
    typeof options?.enabled === "boolean"
      ? options.enabled
      : !!anoLectivo && !!matricula;

  return useQuery<GetCurricularPlanStudentResponse>({
    queryKey: ["curricular-plan-student", { anoLectivo, matricula }],
    queryFn: () => getCurricularPlanStudentService(filters),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
