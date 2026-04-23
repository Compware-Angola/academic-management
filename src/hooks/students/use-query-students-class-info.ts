import { fetchStudentClassInfo, StudentClassInfo, StudentClassInfoParams } from "@/services/students/students-class-info.service";
import {

} from "@/services/students/students.service";
import { useQuery } from "@tanstack/react-query";

/* =============================================
   Classe com mais grades inscritas do aluno
   ============================================= */
export const useStudentClassInfo = (params: StudentClassInfoParams,  enabled: boolean = true) => {
  const { numeroDeMatricula, anoLectivo } = params;

  const queryKey = [
    "student-class-info",
    String(numeroDeMatricula ?? "").trim(),
    anoLectivo ? String(anoLectivo) : null,
  ].filter(Boolean);

  return useQuery<StudentClassInfo, Error>({
    queryKey,
    queryFn: () => fetchStudentClassInfo(params),
   enabled,
    staleTime: 10 * 60 * 1000, 
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
};