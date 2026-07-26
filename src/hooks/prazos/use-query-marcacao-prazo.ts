import { fetchMarcacaoProvaPrazo } from "@/services/prazos/fetch-marcacao-prova-prazo";
import { useQuery } from "@tanstack/react-query";

type MarcacaoProvaPrazoParams = {
  anoLectivo?: number;
  semestre?: number;
  tipoCandidatura?: number;
};

export function useQueryMarcacaoProvaPrazo(params: MarcacaoProvaPrazoParams) {
  const enabled = !!params.anoLectivo && !!params.semestre;

  return useQuery({
    queryKey: ["marcacao-prova-prazo", params],
    queryFn: () =>
      fetchMarcacaoProvaPrazo({
        anoLectivo: params.anoLectivo!,
        semestre: params.semestre!,
        tipoCandidatura: params.tipoCandidatura,
      }),
    enabled,
  });
}
