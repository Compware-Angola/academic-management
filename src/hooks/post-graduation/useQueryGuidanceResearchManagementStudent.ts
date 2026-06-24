import { useQuery } from "@tanstack/react-query";
import {
  GuidanceResearchManagementStudentParams,
  GuidanceResearchManagementStudentResponse,
  getGuidanceResearchManagementStudentService,
} from "@/services/post-graduation/guidance-research-management.service";

export const useQueryGuidanceResearchManagementStudent = (
  filters: GuidanceResearchManagementStudentParams,
  options?: {
    enabled?: boolean;  
  },
) => {
  const {
    search,
    anoLectivo,
    curso,
    tipoCandidatura,
    page = 1,
    limit = 10,
  } = filters;

  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : true;

  return useQuery<GuidanceResearchManagementStudentResponse>({
    queryKey: [
      "estudante-finalista",
      {
        search,
        anoLectivo,
        curso,
        tipoCandidatura,
        page,
        limit,
      },
    ],
    queryFn: () => getGuidanceResearchManagementStudentService(filters),
    enabled,
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10, 
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};