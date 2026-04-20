import { axiosNestGa } from "@/lib/axios-nest-ga";

export type CollisionExistenceResponse = {
  existe: boolean;
};

/**
 * Verifica se existe isenção de colisão para uma matrícula em um determinado ano lectivo.
 * Endpoint: GET /registration/colisoes/matricula/existe?matricula=<...>&anoLectivo=<...>
 */
export async function checkCollisionMatriculaService(
  matricula: number,
  anoLectivo: number,
): Promise<CollisionExistenceResponse> {
  const { data } = await axiosNestGa.get<CollisionExistenceResponse>(
    "/registration/colisoes/matricula/existe",
    {
      params: {
        matricula,
        anoLectivo,
      },
    },
  );
  return data;
}

/**
 * Verifica se existe isenção de colisão para um curso em um determinado ano lectivo.
 * Endpoint: GET /registration/colisoes/curso/existe?curso=<...>&anoLectivo=<...>
 */
export async function checkCollisionCursoService(
  curso: number,
  anoLectivo: number,
): Promise<CollisionExistenceResponse> {
  const { data } = await axiosNestGa.get<CollisionExistenceResponse>(
    "/registration/colisoes/curso/existe",
    {
      params: {
        curso,
        anoLectivo,
      },
    },
  );
  return data;
}