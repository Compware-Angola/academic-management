import {
  fetchPrimaryRecords,
  FetchPrimaryRecordsParams,
  FetchPrimaryRecordsResponse,
} from "@/services/post-graduation/fetch-primary-records.service";
import { useQuery } from "@tanstack/react-query";

type UseQueryPrimaryRecordsOptions = {
  enabled?: boolean;
};

export function useQueryPrimaryRecords(
  params: FetchPrimaryRecordsParams,
  options?: UseQueryPrimaryRecordsOptions
) {
  const hasValidAcademicYear =
    Number.isInteger(params.academicYearId) && params.academicYearId > 0;

  return useQuery<FetchPrimaryRecordsResponse>({
    queryKey: ["post-graduation-primary-records", params],
    queryFn: () => fetchPrimaryRecords(params),
    enabled: (options?.enabled ?? true) && hasValidAcademicYear,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}
