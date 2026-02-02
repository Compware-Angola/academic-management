import { axiosNestGa } from "@/lib/axios-nest-ga";

/**
 * Payload para criação de prazo académico
 * (alinhado com CreateAcademicActivitiesTermsDto - Backend)
 */
export interface CreatePrazoPayload {
  /** Tipo de avaliação */
  fk_tipo_avaliacao: number;

  /** Semestre */
  fk_semestre: number;

  /** Tipo de prazo */
  fk_tipo_prazo: number;

  /** Ano lectivo */
  fk_ano_lectivo: number;

  /** Data de início (ISO 8601) */
  data_inicio: string;

  /** Data de fim (ISO 8601) */
  data_fim: string;

  /** Observação (opcional) */
  observacao?: string;

  /** Utilizador que cria o prazo */
  fk_created_by: number;

  /** Tipo de candidatura (ex: N, R, E, etc.) */
  tipo_candidatura: string;
}

/**
 * Criar prazo académico
 */
export async function createPrazo(payload: CreatePrazoPayload) {
  const response = await axiosNestGa.post(
    "/academic-activities/terms",
    payload
  );

  return response.data;
}
