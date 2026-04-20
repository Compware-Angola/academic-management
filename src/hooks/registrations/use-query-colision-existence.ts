import { checkCollisionCursoService, checkCollisionMatriculaService, CollisionExistenceResponse } from "@/services/registrations/fetch-colision-existence";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para verificar se existe isenção de colisão para uma matrícula em um determinado ano lectivo.
 */
export function useQueryCollisionMatriculaExistence(
  matricula: number | undefined,
  anoLectivo: number | undefined,
) {
  const enabled =
    typeof matricula === "number" &&
    matricula > 0 &&
    typeof anoLectivo === "number" &&
    anoLectivo > 0;

  return useQuery<CollisionExistenceResponse>({
    queryKey: ["collision-exists-matricula", matricula, anoLectivo],
    queryFn: () =>
      checkCollisionMatriculaService(
        matricula as number,
        anoLectivo as number,
      ),
    enabled,
  });
}

/**
 * Hook para verificar se existe isenção de colisão para um curso em um determinado ano lectivo.
 */
export function useQueryCollisionCursoExistence(
  curso: number | undefined,
  anoLectivo: number | undefined,
) {
  const enabled =
    typeof curso === "number" &&
    curso > 0 &&
    typeof anoLectivo === "number" &&
    anoLectivo > 0;

  return useQuery<CollisionExistenceResponse>({
    queryKey: ["collision-exists-curso", curso, anoLectivo],
    queryFn: () =>
      checkCollisionCursoService(
        curso as number,
        anoLectivo as number,
      ),
    enabled,
  });
}