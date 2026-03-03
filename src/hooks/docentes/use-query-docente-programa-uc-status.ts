import {
  fetchProgramaUCStatus,
  ProgramaUCStatus,
} from "@/services/docentes/docente-programa-uc-status.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryProgramaUCEstado() {
  return useQuery<ProgramaUCStatus[]>({
    queryKey: ["programa-uc-estado"],
    queryFn: fetchProgramaUCStatus,
  });
}
