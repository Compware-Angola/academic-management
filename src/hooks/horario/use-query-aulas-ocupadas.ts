import {
  AulasOcupadasPorDia,
  fetchAulasOcupadas,
} from "@/services/horario/fetch-aulas-ocupadas.service";
import { useQuery } from "@tanstack/react-query";

type UseAulasOcupadasParams = {
  salaId?: string;
  anoLectivo?: string;
  periodo?: string;
};

export function useQueryAulasOcupadas(params: UseAulasOcupadasParams = {}) {
  return useQuery<AulasOcupadasPorDia[], Error>({
    queryKey: [
      "aulas-ocupadas",
      params.salaId,
      params.anoLectivo,
      params.periodo,
    ],
    queryFn: async () => {
      if (!params.salaId || !params.anoLectivo || !params.periodo) {
        return [];
      }

      return fetchAulasOcupadas({
        salaId: Number(params.salaId),
        anoLectivo: Number(params.anoLectivo),
        periodo: Number(params.periodo),
      });
    },
    enabled: !!params.salaId && !!params.anoLectivo && !!params.periodo,
  });
}
