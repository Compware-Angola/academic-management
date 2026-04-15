import { SearchStudentCollisionExemptionParams, SearchStudentCollisionExemptionResponse, searchStudentsCollisionExemptionService } from "@/services/registrations/search-student-collision-exemption.service";
import { useQuery } from "@tanstack/react-query";

export function useQuerySearchStudentsCollisionExemption(
  params: SearchStudentCollisionExemptionParams
) {
  const enabled =
    Number(params.anoLectivo) > 0 &&
    Number(params.curso) > 0 &&
    Number(params.turno) > 0 &&
    !!params.search?.trim();

  return useQuery<SearchStudentCollisionExemptionResponse>({
    queryKey: ["search-students-collision-exemption", params],
    queryFn: () => searchStudentsCollisionExemptionService(params),
    enabled,
  });
}