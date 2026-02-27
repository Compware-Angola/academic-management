import { useQuery } from "@tanstack/react-query";
import { getDocenteCadeirasService, CadeiraItem } from "@/services/docentes/docente-cadeiras.service";

export function useQueryDocenteCadeiras(
  docenteId?: number,
  cursoId?: number,
) {
  return useQuery<CadeiraItem[]>({
    queryKey: ["docente-cadeiras", docenteId, cursoId],
    queryFn: async () => {
      const response = await getDocenteCadeirasService({
        docenteId: docenteId as number,
        cursoId: cursoId as number,
      });

      return response.data;
    },
    enabled: !!docenteId && !!cursoId,
  });
}
