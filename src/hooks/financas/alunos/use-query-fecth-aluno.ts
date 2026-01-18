import {
  AlunoMatriculaResponse,
  fetchAlunoMatricula,
} from "@/services/financas/alunos/fetch-alunos.service";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useQueryAlunoMatricula(
  enrollmentCode?: string,
  enabled = false
) {
  return useQuery<AlunoMatriculaResponse, AxiosError<{ message: string }>>({
    queryKey: ["aluno-matricula", enrollmentCode],
    queryFn: () => fetchAlunoMatricula(Number(enrollmentCode)),
    enabled: !!Number(enrollmentCode) && enabled,
    retry: false,
    select: (data) => data,
    throwOnError: false,
  });
}
