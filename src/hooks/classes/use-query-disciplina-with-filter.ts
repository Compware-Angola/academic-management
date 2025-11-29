import { fetchClassByCurso ,Classes} from "@/services/classes/class-filter-by-curso";
import { useQuery } from "@tanstack/react-query";

type FilterClassesParams = {
  curso?: string;

 }
export function useQueryClassFilterByCurso(params: FilterClassesParams = {}) {
  return useQuery<Classes[], Error>({
    queryKey: ["classes-with-filter",params.curso,],
    queryFn: async () => {
      if(!params.curso ) {
        return [];
      }
     return fetchClassByCurso({curso:params.curso});
    } ,
    enabled: !!params.curso,
   staleTime: 5 * 60 * 1000,

  });
}
