import {
  validarEstudanteCredito,
  ValidarEstudanteCreditoParams,
  ValidarEstudanteCreditoResponse,
} from "@/services/financas/credito-educacional/validar-estudante-credito.service";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useQueryValidarEstudanteCredito(
  params: ValidarEstudanteCreditoParams,
  enabled = false,
) {
  return useQuery<
    ValidarEstudanteCreditoResponse,
    AxiosError<{ message: string }>
  >({
    queryKey: ["credito-educacional-estudante-validar", params],
    queryFn: () => validarEstudanteCredito(params),
    enabled:
      enabled &&
      !!params.codigoMatricula &&
      !!params.codigoAnoLectivo &&
      !!params.semestre,
    retry: false,
    throwOnError: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}
