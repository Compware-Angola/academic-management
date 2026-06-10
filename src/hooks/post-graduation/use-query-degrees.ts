import {
  fetchPostGraduationDegrees,
  FetchPostGraduationDegreesResponse,
} from "@/services/post-graduation/fetch-degrees.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryPostGraduationDegrees() {
  return useQuery<FetchPostGraduationDegreesResponse>({
    queryKey: ["post-graduation-degrees"],
    queryFn: fetchPostGraduationDegrees,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}
