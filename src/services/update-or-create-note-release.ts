import { axiosNestGa } from "@/lib/axios-nest-ga";

// ====================== TIPAGENS ======================

export interface RefUtilizador {
  pk: number;
  desc: string;
  corLetra: string;
  disponivel: boolean;
}

// Payload de uma única nota
export interface NoteUpsertPayload {
  gradeCurricularAluno: number;
  utilizador: number;
  nota: number;
  tipoDeProva: number;
  epoca: number;
  tipoAvaliacao: number;
  observacao: string | null;
  status: number;
  notaAnterior: number;
  codigo_grade_avaliacao_aluno?: number | null;
}

// Payload que o Backend realmente espera
export interface NoteUpsertRequest {
  items: NoteUpsertPayload[];   // ← Esta é a propriedade que o backend está à espera
}

// Resposta da API
export interface NoteUpsertResponse {
  success: boolean;
  message: string;
  data?: any;
}

// ====================== FUNÇÃO PRINCIPAL ======================

/**
 * Cria ou atualiza uma ou várias notas
 * Sempre envia um objeto { items: [...] } como o backend espera
 */
export async function upsertNote(
  payloads: NoteUpsertPayload[]   // No frontend continuas a passar array
): Promise<NoteUpsertResponse> {
  try {
    const requestBody: NoteUpsertRequest = {
      items: payloads,   // encapsula o array dentro de "items"
    };

    const response = await axiosNestGa.post<NoteUpsertResponse>(
      "/assessment/upsert",
      requestBody
    );

    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar/atualizar nota(s):", error);

    let errorMessage = "Erro desconhecido ao lançar as notas";

    if (error?.response?.data?.message) {
      errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" | ")
        : String(error.response.data.message);
    } else if (error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
}