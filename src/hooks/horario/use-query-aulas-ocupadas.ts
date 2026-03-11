import {
  AulasOcupadasPorDia,
  fetchAulasOcupadas,
} from "@/services/horario/fetch-aulas-ocupadas.service";
import { useQuery } from "@tanstack/react-query";

type UseAulasOcupadasParams = {
  salaId?: string;
  anoLectivo?: string;
  periodo?: string;
  semestre?:string;
  horarioId?:number
};
export function useQueryAulasOcupadas(params: UseAulasOcupadasParams = {}) {
  return useQuery<AulasOcupadasPorDia[], Error>({
    queryKey: [
      "aulas-ocupadas",
      params.salaId,
      params.anoLectivo,
      params.periodo,
      params.semestre,
      params.horarioId
    ],
    queryFn: async () => {
      if (!params.salaId || !params.anoLectivo || !params.periodo) {
        return [];
      }

      return fetchAulasOcupadas({
        salaId: Number(params.salaId),
        anoLectivo: Number(params.anoLectivo),
        periodo: Number(params.periodo),
        semestre: Number(params.semestre),
        ...(params.horarioId !== undefined && {
          horarioId: Number(params.horarioId),
        }),
      });
    },
    enabled: !!params.salaId && !!params.anoLectivo && !!params.periodo,
  });
}