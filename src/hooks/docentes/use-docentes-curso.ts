import { useQuery } from "@tanstack/react-query";
import {
  getDocenteCursosService,
  CursoItem,
  DocenteCursoProps,
} from "@/services/docentes/docente-cursos.service";

export function useQueryDocenteCursos(props: DocenteCursoProps) {
  const { anoLectivo, docenteId } = props;
  return useQuery<CursoItem[]>({
    queryKey: ["docente-cursos", docenteId, anoLectivo],
    queryFn: async () => {
      const response = await getDocenteCursosService(props);
      return response.data;
    },
    enabled: !!docenteId && !!anoLectivo,
  });
}
