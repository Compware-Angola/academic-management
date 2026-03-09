import { fetchAssiduidadeDocente, FiltroAssiduidadePayload } from "@/services/docentes/docente-assiduidade";
import { useQuery } from "@tanstack/react-query";


export const useAssiduidadeDocente = (filters: FiltroAssiduidadePayload) => {
  return useQuery({
    
    queryKey: ["assiduidade-docente", filters],
    queryFn: () => fetchAssiduidadeDocente(filters),
    enabled: !!filters.docenteId, 
    staleTime: 1000 * 60 * 5,   
  });
};