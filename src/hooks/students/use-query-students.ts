// hooks/useStudents.ts
import { GetAcademicHistoryEquivalencyParams, GetAcademicHistoryMigrationParams, GetAcademicHistoryParams, studentAcademicHistoryEquivalencyService, studentAcademicHistoryMigrationService, studentAcademicHistoryService, } from "@/services/students/academic-history.service";
import { activeRegistration, ActiveRegistrationPayload } from "@/services/students/active-registration.service";
import { resetPassword, ResetPasswordPayload } from "@/services/students/reset-password.service";
import {
  fetchStudentEstatisticas,
  fetchStudentsSugestoes,
  fetchDisciplinasMatriculadas,
  StudentDetail,
  StudentSugestao,
  DisciplinasResponse,
  FetchDisciplinasMatriculadasParams,
  UpdatePersonalDataPayload,
  updatePersonalData,
} from "@/services/students/students.service";

import {
  getListStudentsService,
  ListStudentsPayload,
  ListStudentsResponse,
} from "@/services/students/students.service";
import { updateContacts, UpdateContactsPayload } from "@/services/students/update-contacts";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  const { matriculaId, anoLectivo, semestre, page = 1, limit = 25,classes } = params;

  // Chave única que considera todos os filtros importantes
  const queryKey = [
    "student-disciplinas",
    String(matriculaId ?? "").trim(),
    anoLectivo ? String(anoLectivo) : null,
    semestre ? String(semestre) : null,
    classes ? String(classes) : null,
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

export function useResetPassword() {
  return useMutation<void, Error, ResetPasswordPayload>({
    mutationFn: (payload) => resetPassword(payload),
    onSuccess: () => {
      toast.success("Senha redefinida com sucesso!");
    },
  });
}

export function useUpdateContacts() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, UpdateContactsPayload>({
    mutationFn: (payload) => updateContacts(payload),
    onSuccess: () => {
      toast.success("Contactos atualizados com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["student-detail"],
      });
    },
  });
}



export function useUpdatePersonalData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePersonalDataPayload) => updatePersonalData(payload),
    onSuccess: () => {
      toast.success("Dados pessoais atualizados com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["student-detail"],
      });
    },
  });
}

export function useActiveRegistration() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, ActiveRegistrationPayload>({
    mutationFn: (payload) => activeRegistration(payload),
    onSuccess: () => {
      toast.success("Matrícula ativada com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["student-detail"],
      });
    },
  });
}

export const useStudentAcademicHistory = (params: GetAcademicHistoryParams) => {
  return useQuery({
    queryKey: ['student-academic-history', params.matriculaId, params.anoLectivoId, params.page, params.search],
    queryFn: () => studentAcademicHistoryService(params),
    enabled: !!params.matriculaId && !!params.anoLectivoId,
    staleTime: 1000 * 60 * 5,
  });
};


export const useStudentAcademicHistoryEquivalency = (params: GetAcademicHistoryEquivalencyParams) => {
  return useQuery({
    queryKey: ['student-academic-history-equivalency', params.matriculaId, params.anoLectivoId, params.page, params.search],
    queryFn: () => studentAcademicHistoryEquivalencyService(params),
    enabled: !!params.matriculaId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useStudentAcademicHistoryMigration = (params: GetAcademicHistoryMigrationParams) => {
  return useQuery({
    queryKey: ['student-academic-history-migration', params.matriculaId, params.anoLectivoId, params.page, params.search],
    queryFn: () => studentAcademicHistoryMigrationService(params),
    enabled: !!params.matriculaId,
    staleTime: 1000 * 60 * 5,
  });
};