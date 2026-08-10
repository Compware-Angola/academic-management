import {
  GetDepartmentDisciplineParams,
  GetDepartmentDisciplineResponse,
  getDepartmentDisciplinesService,
} from "@/services/departamento/fetch-departamento-uc";
import { useQuery } from "@tanstack/react-query";

export function useQueryDepartamentoUC(params: GetDepartmentDisciplineParams) {
  const { departamento, search, page, limit } = params;

  return useQuery<GetDepartmentDisciplineResponse, Error>({
    queryKey: ["departamento-uc", departamento, search, page, limit],
    queryFn: () =>
      getDepartmentDisciplinesService({
        departamento,
        search,
        page,
        limit,
      }),
    enabled: !!departamento,
    staleTime: 5 * 60 * 1000,
  });
}
