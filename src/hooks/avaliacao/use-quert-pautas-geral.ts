import { getPautasGeral } from "@/services/avaliacao/pautas-geral";
import { useQuery } from "@tanstack/react-query";
type PautasGeralParams = {
  anoLectivo?: string;
  gradeCurricular: string;
  horario: string;
  semestre: string;
};
export function usePautasGeral(params?: PautasGeralParams, enabled = false) {
  return useQuery({
    queryKey: ["pautas-geral", params],
    queryFn: () =>
      getPautasGeral({
        anoLectivo: params!.anoLectivo!,
        gradeCurricular: params!.gradeCurricular!,
        horario: params!.horario!,
        semestre: params!.semestre!,
      }),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(
      params?.anoLectivo &&
        params?.gradeCurricular &&
        params?.horario &&
        params?.semestre &&
        enabled
    ),
  });
}
