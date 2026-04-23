import {
  ResultPlanResponse,
  getResultPlanService,
} from "@/services/students/fetch-result-plan.service";
import { useQuery } from "@tanstack/react-query";

interface QueryResultPlan {
  enabled?: boolean;
}

export function useQueryResultPlan(
  codigoMatricula: number,
  options?: QueryResultPlan,
) {
  const defaultEnabled = !!codigoMatricula;

  return useQuery<ResultPlanResponse>({
    queryKey: ["resultado-plano", codigoMatricula],
    queryFn: () => getResultPlanService(codigoMatricula),
    enabled: options?.enabled ?? defaultEnabled,
  });
}
