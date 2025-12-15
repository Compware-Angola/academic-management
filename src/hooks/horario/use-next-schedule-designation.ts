import {
  gerarDesignacao,
  getNextScheduleDesignationService,
} from "@/services/horario/schedule-designation.service";
import { useQuery } from "@tanstack/react-query";

export const useNextScheduleDesignation = (
  cursoSigla?: string,
  ano?: string,
  codigoUC?: string
) => {
  const base =
    cursoSigla && ano && codigoUC
      ? `${cursoSigla}.${ano}.${codigoUC}`
      : undefined;

  return useQuery({
    queryKey: ["next-schedule-designation", base],
    queryFn: async () => {
      if (!base) return `${cursoSigla}.${ano}.${codigoUC}-H1`;
      const response = await getNextScheduleDesignationService(base);
      return gerarDesignacao(base, response);
    },
    enabled: !!base,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};
