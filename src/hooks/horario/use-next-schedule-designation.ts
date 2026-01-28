import {
  gerarDesignacao,
  getNextScheduleDesignationService,
} from "@/services/horario/schedule-designation.service";
import { useQuery } from "@tanstack/react-query";

export const useNextScheduleDesignation = (
  cursoSigla?: string,
  ano?: string,
  codigoUC?: string,
  periodo?: number,
  anoLectivo?: number,
) => {
  const base =
    cursoSigla && ano && codigoUC
      ? `${cursoSigla}.${ano}.${codigoUC}`
      : undefined;

  return useQuery({
    queryKey: ["next-schedule-designation", base, periodo, anoLectivo],
    queryFn: async () => {
      if (!base || !periodo || !anoLectivo) {
        return base ? `${base}-H1` : "";
      }

      const response = await getNextScheduleDesignationService({
        base,
        periodo,
        anoLectivo,
      });

      return gerarDesignacao(base, response);
    },
    enabled: !!base && !!periodo && !!anoLectivo,
    retry: 1,
  });
};
