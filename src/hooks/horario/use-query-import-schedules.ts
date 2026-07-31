import {
  importSchedules,
  ImportSchedulesParams,
} from "@/services/horario/fetch-import-horario";
import { useQuery } from "@tanstack/react-query";

export const useQueryImportSchedules = (
  params: ImportSchedulesParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["import-schedules", params],

    queryFn: () => importSchedules(params),

    enabled:
      enabled &&
      !!params.fkanoLectivoOrigem &&
      !!params.fkanoLectivoDestino &&
      !!params.fkCurso &&
      !!params.fkClasse &&
      !!params.fksemestre &&
      !!params.fkperiodo,
  });
};
