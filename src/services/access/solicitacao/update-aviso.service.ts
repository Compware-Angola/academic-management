import { axiosNestGa } from "@/lib/axios-nest-ga";

/**
 * Estrutura de dados para atualizar um aviso UMA.
 * O campo `id` identifica qual aviso será atualizado. Os demais campos
 * correspondem às propriedades que podem ser alteradas. Todas são opcionais,
 * permitindo enviar apenas os campos necessários.
 */
export interface UpdateAvisoRequest {
  /** Identificador do aviso a ser atualizado */
  id: number;
  /** Assunto do aviso */
  assunto?: string;
  /** Data de expiração no formato ISO (YYYY-MM-DD) */
  date_expiracao?: string;
  /** Identificador do autor da edição (opcional) */
  userId?: number;
  /** Texto descritivo */
  descricao?: string;
  /** Sigla associada ao aviso */
  sigla?: string;
  /** Nome do ficheiro anexo */
  fileName?: string;
  /** Destino do aviso (identificador de destino) */
  destino?: number;
  /** Curso associado ao aviso */
  curso?: number;
  /** Período associado ao aviso */
  periodo?: number;
  /** Canal de comunicação */
  canal?: number;
  /** Estado do aviso */
  status?: number;
  /** Origem do aviso */
  origem?: number;
}

/**
 * Resposta retornada após atualizar um aviso.
 */
export interface UpdateAvisoResponse {
  message: string;
}

/**
 * Faz uma requisição HTTP para editar um aviso existente.
 *
 * @param payload Objeto contendo o `id` do aviso e os campos a serem atualizados
 * @returns Uma promessa com a mensagem de sucesso
 */
export async function updateAvisoService(
  payload: UpdateAvisoRequest
): Promise<UpdateAvisoResponse> {
  const { id, ...rest } = payload;

  const { data } = await axiosNestGa.put(
    `/solicitacoa/aviso/${id}`,
    rest
  );

  return data;
}