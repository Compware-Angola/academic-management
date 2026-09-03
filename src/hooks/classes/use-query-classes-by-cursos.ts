import {
  fetchClassByCurso,
  Classes,
} from "@/services/classes/class-filter-by-curso";
import { useQuery } from "@tanstack/react-query";

export function useQueryClassesByCursos(cursos: (string | number)[] = []) {
  const cursosNormalizados = Array.from(
    new Set(
      (cursos ?? [])
        .map((curso) => String(curso).trim())
        .filter((curso) => curso.length > 0),
    ),
  );

  return useQuery<Classes[], Error>({
    queryKey: ["classes-by-cursos", cursosNormalizados],
    queryFn: async () => {
      if (cursosNormalizados.length === 0) {
        return [];
      }

      const resultados = await Promise.all(
        cursosNormalizados.map((curso) => fetchClassByCurso({ curso })),
      );

      const merged = new Map<number, Classes>();
      for (const classe of resultados.flat()) {
        merged.set(classe.codigo, classe);
      }

      return Array.from(merged.values()).sort((a, b) => a.codigo - b.codigo);
    },
    enabled: cursosNormalizados.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
