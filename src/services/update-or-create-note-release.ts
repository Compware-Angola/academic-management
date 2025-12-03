import { axiosNestGa } from "@/lib/axios-nest-ga";

// Tipagem do utilizador de referência
export interface RefUtilizador {
  pk: number;
  desc: string;
  corLetra: string;
  disponivel: boolean;
}

// Payload para criar ou atualizar nota
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
  refUtilizador: RefUtilizador;
  codigo_grade_avaliacao_aluno?: number | null; 
}

// Resposta da API (adapte conforme necessário)
export interface NoteUpsertResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Função para criar ou atualizar nota
export async function upsertNote(payload: NoteUpsertPayload): Promise<NoteUpsertResponse> {
  try {
    const response = await axiosNestGa.post<NoteUpsertResponse>("/assessment/upsert", payload);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar/atualizar nota:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Erro desconhecido",
    };
  }
}
