import { fetchDepartamentoUC, DepartamentoUC } from "@/services/departamento/fetch-departamento-uc";
import { useQuery } from "@tanstack/react-query";

type FilterDisciplinaParams = {
  departamento?: string;
  semestre?: string;
  classe?: string;
 }
export function useQueryDepartamentoUC(params: FilterDisciplinaParams = {}) {
  return useQuery<DepartamentoUC[], Error>({
    queryKey: ["departamento-uc",params.classe,params.departamento,params.semestre],
    queryFn: async () => {
      if(!params.departamento || !params.semestre || !params.classe) {
        return [];
      }
     return fetchDepartamentoUC({classe:params.classe,departamento:params.departamento,semestre:params.semestre});
    } ,
    enabled: !!params.departamento && !!params.semestre && !!params.classe,
   staleTime: 5 * 60 * 1000,

  });
}
