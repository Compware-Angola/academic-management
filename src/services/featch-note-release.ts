import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface NoteRelease {
  codigo_grade_aluno: number;
  numero_de_matricula: number;
  nome_completo: string;
  codigo_grade_avaliacao_aluno: number | null;
  status: string | null;
  observacao: string | null;
  nota: number | null;
  codigo_confirmacao: number;
  horario: {
    pk: number;
    desc: string;
    corLetra: string;
    disponivel: boolean;
  } | null;
  docente: {
    pk: number;
    desc: string;
    corLetra: string;
    disponivel: boolean;
  } | null;
  datalancamento: string | null;
  datadeatualizacao: string | null;
  hora: number | null;
  minuto: number | null;
  horacriacao: number | null;
  minutocriacao: number | null;
}

export interface NoteReleaseApiResponse {
  success: boolean;
  data: NoteRelease[];
}

// Função para buscar notas com filtros obrigatórios
export async function fetchNoteReleases(params: {
  anoLectivoId: number;
  gradeCurricularId: number;
  tipoProvaId: number;
  tipoAvaliacao: number;
  classe: number;
  turno:number
}): Promise<NoteRelease[]> {
  try {
    const response = await axiosNestGa.get<NoteReleaseApiResponse>(
      "/assessment/filtrar",
      { params }
    );

    const items = response.data.data ?? []; // <-- CORREÇÃO: pega o array dentro de `data`

    // Converter campos JSON de string para objeto
    return items.map((item) => ({
      ...item,
      horario: typeof item.horario === "string" ? JSON.parse(item.horario) : item.horario,
      docente: typeof item.docente === "string" ? JSON.parse(item.docente) : item.docente,
    }));
  } catch (error) {
    console.error("Erro ao buscar notas:", error);
    return [];
  }
}
