// hooks/useStudents.ts
import { fetchStudentEstatisticas, fetchStudentsSugestoes, StudentDetail, StudentSugestao } from '@/services/students/students.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useStudentSugestoes = (search: string = '') => {
  const queryKey = ['students-sugestoes', search.trim().toLowerCase()];

  return useQuery<StudentSugestao[], Error>({
    queryKey,
    queryFn: () => fetchStudentsSugestoes ({ search }),
    enabled: search.trim().length > 0,       // só faz fetch se tiver search
    staleTime: 2 * 60 * 1000,               // 2 minutos de cache
    gcTime: 5 * 60 * 1000,                  // garbage collect após 5 min
    retry: 1,
  });
};

// =======================
// Hook para detalhes de um aluno específico
// =======================
export const useStudentDetail = (codigoMatricula?: number | string) => {
  const queryClient = useQueryClient();

  return useQuery<StudentDetail, Error>({
    queryKey: ['student-detail', codigoMatricula],
    queryFn: () => fetchStudentEstatisticas(codigoMatricula!),
    enabled: !!codigoMatricula,              // só executa se tiver ID
    staleTime: 10 * 60 * 1000,               
   
  });
};