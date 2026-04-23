import { fetchStudentInfoService, StudentInfoItem } from "@/services/registrations/fetch-student-info-colisao.service";
import { useQuery } from "@tanstack/react-query";


/**
 * Hook para buscar informações de um estudante por matrícula.
 * Só dispara a requisição se o parâmetro `matricula` for um número > 0.
 */
export function useQueryStudentInfo(matricula: number | undefined) {
  const enabled = typeof matricula === "number" && matricula > 0;

  return useQuery<StudentInfoItem>({
    queryKey: ["student-info", matricula],
    queryFn: () => fetchStudentInfoService(matricula as number),
    enabled,
  });
}