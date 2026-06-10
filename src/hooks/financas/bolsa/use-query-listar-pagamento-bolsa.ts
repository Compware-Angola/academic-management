import { useQuery } from "@tanstack/react-query";
import {
  ListarPagamentoBolsaParams,
  listarPagamentoBolsa,
} from "@/services/financas/bolsa/pagamento-bolsa.service";

export const useListarPagamentoBolsa = (
  params?: ListarPagamentoBolsaParams,
) => {
  return useQuery({
    queryKey: [
      "bolsa",
      "pagamentos",
      params?.anoLectivo,
      params?.semestre,
      params?.codigoBolsa,
      params?.codigoInstituicao,
      params?.page,
      params?.limit,
    ],
    queryFn: () => listarPagamentoBolsa(params),
    staleTime: 1000 * 60 * 5,
  });
};
