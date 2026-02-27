import { useQuery } from "@tanstack/react-query";
import { getDocenteCursosService, CursoItem } from "@/services/docentes/docente-cursos.service";

export function useQueryDocenteCursos(docenteId?: number) {
  return useQuery<CursoItem[]>({
    queryKey: ["docente-cursos", docenteId],
    queryFn: async () => {
      const response = await getDocenteCursosService(docenteId as number);
      return response.data;
    },
    enabled: !!docenteId,
  });
}
