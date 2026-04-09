// hooks/useStudents.ts
import {
  fetchStudentEstatisticas,
  fetchStudentsSugestoes,
  fetchDisciplinasMatriculadas,
  StudentDetail,
  StudentSugestao,
  DisciplinasResponse,
  FetchDisciplinasMatriculadasParams,
} from "@/services/students/students.service";

import {
  getListStudentsService,
  ListStudentsPayload,
  ListStudentsResponse,
} from "@/services/students/students.service";

import { useQuery, useQueryClient } from "@tanstack/react-query";

/* =============================================
   Sugestões de alunos (busca por nome, BI, etc.)
   ============================================= */
export const useStudentSugestoes = (search: string = "") => {
  const queryKey = ["students-sugestoes", search.trim().toLowerCase()];

  return useQuery<StudentSugestao[], Error>({
    queryKey,
    queryFn: () => fetchStudentsSugestoes({ search }),
    enabled: search.trim().length > 2, // mínimo 3 caracteres para buscar (ajuste se quiser)
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos antes de garbage collect
    retry: 1,
  });
};

/* =============================================
   Detalhes completos / estatísticas de um aluno
   ============================================= */
export const useStudentDetail = (codigoMatricula?: number | string) => {
  return useQuery<StudentDetail, Error>({
    queryKey: ["student-detail", String(codigoMatricula ?? "").trim()],
    queryFn: () => fetchStudentEstatisticas(codigoMatricula!),
    enabled: !!codigoMatricula && String(codigoMatricula).trim().length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
};

/* =============================================
   Disciplinas / cadeiras matriculadas do aluno
   ============================================= */
export const useStudentDisciplinas = (
  params: FetchDisciplinasMatriculadasParams,
) => {
  const { matriculaId, anoLectivo, semestre, page = 1, limit = 25 } = params;

  // Chave única que considera todos os filtros importantes
  const queryKey = [
    "student-disciplinas",
    String(matriculaId ?? "").trim(),
    anoLectivo ? String(anoLectivo) : null,
    semestre ? String(semestre) : null,
    page,
    limit,
  ].filter(Boolean); // remove null/undefined

  return useQuery<DisciplinasResponse, Error>({
    queryKey,
    queryFn: () => fetchDisciplinasMatriculadas(params),
    enabled: !!matriculaId && String(matriculaId).trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos (disciplinas mudam pouco)
    gcTime: 30 * 60 * 1000,
    retry: 1,
    // keepPreviousData: true,                 // descomente se quiser manter dados antigos durante refetch
  });
};

// =============================================
// Função auxiliar para invalidar/refetchar caches
// (útil após alguma ação que altera matrícula/disciplinas)
// =============================================
export const invalidateStudentQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  codigoMatricula?: string | number,
) => {
  const matriculaStr = codigoMatricula ? String(codigoMatricula).trim() : null;

  queryClient.invalidateQueries({ queryKey: ["student-detail", matriculaStr] });
  queryClient.invalidateQueries({
    queryKey: ["student-disciplinas", matriculaStr],
  });
  // se quiser invalidar sugestões também (menos comum):
  // queryClient.invalidateQueries({ queryKey: ['students-sugestoes'] });
};

export function useQueryStudents(payload: ListStudentsPayload) {
  const { codigoCurso, faculdadeId, codigoMatricula, page, limit } = payload;

  return useQuery<ListStudentsResponse>({
    queryKey: [
      "students",
      codigoCurso,
      faculdadeId,
      codigoMatricula,
      page,
      limit,
    ],
    queryFn: () => getListStudentsService(payload),
  });
}
