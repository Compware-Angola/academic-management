import { useQuery } from "@tanstack/react-query";
import {
  getDocenteCadeirasService,
  CadeiraItem,
  DocenteCadeirasPayload,
} from "@/services/docentes/docente-cadeiras.service";

export function useQueryDocenteCadeiras(params: DocenteCadeirasPayload) {
  const { docenteId, cursoId, classeId, anoLectivo, semestreId } = params;
  return useQuery<CadeiraItem[]>({
    queryKey: [
      "docente-cadeiras",
      docenteId,
      cursoId,
      classeId,
      anoLectivo,
      semestreId,
    ],
    queryFn: async () => {
      const response = await getDocenteCadeirasService(params);

      return response.data;
    },
    enabled: !!docenteId && !!cursoId && !!classeId && !!anoLectivo,
  });
}
