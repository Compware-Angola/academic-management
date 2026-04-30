import { FetchServicosPagosAlunoParams, fetchServicosPagosAlunoService, ServicoPagoAluno } from "@/services/financas/nota-pagamento/fetch-servicos-pago-aluno.service";
import { useQuery } from "@tanstack/react-query";


type UseQueryServicosPagosAlunoOptions = {
  enabled?: boolean;
};

export function useQueryServicosPagosAluno(
  params: FetchServicosPagosAlunoParams,
  options?: UseQueryServicosPagosAlunoOptions
) {
  return useQuery<ServicoPagoAluno[]>({
    queryKey: [
      "servicos-pagos-aluno",
      params.anoLectivo,
      params.codigoMatricula,
      params.tipo,
    ],
    queryFn: () => fetchServicosPagosAlunoService(params),
    enabled:
      options?.enabled ??
      (!!params.anoLectivo && !!params.codigoMatricula),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}