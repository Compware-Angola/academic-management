import {
  fetchDepartamentoUC,
  GetDisciplineDepartmentPayload,
  GetDisciplineDepartmentResponse,
} from "@/services/departamento/fetch-departamento-uc";
import { useQuery } from "@tanstack/react-query";

export function useQueryDepartamentoUC(params: GetDisciplineDepartmentPayload) {
  const { classe, departamento, semestre, limit, page } = params;
  return useQuery<GetDisciplineDepartmentResponse, Error>({
    queryKey: ["departamento-uc", classe, departamento, semestre, limit, page],
    queryFn: () =>
      fetchDepartamentoUC({
        classe,
        departamento,
        semestre,
        limit,
        page,
      }),
    enabled: !!departamento && !!semestre && !!classe,
    staleTime: 5 * 60 * 1000,
  });
}
