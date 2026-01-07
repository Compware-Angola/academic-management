import {
  GetAssessmentAttendanceParameterResponse,
  getAssessmentAttendanceParameterService,
} from "@/services/avaliacao/fetch-assessment-attendance-parameter";
import { useQuery } from "@tanstack/react-query";

export const useQueryAssessmentAttendanceParameters = (options?: {
  enabled?: boolean;
}) => {
  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : true;

  return useQuery<GetAssessmentAttendanceParameterResponse>({
    queryKey: ["assessment-attendance-parametros"],
    queryFn: getAssessmentAttendanceParameterService,
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
