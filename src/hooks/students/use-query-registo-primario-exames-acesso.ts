import { FetchRegistoPrimarioExamesAcessoParams, FetchRegistoPrimarioExamesAcessoResponse, fetchRegistoPrimarioExamesAcessoService } from "@/services/students/fetch-registo-primario-exame-acesso.service";
import { useQuery } from "@tanstack/react-query";


export function useQueryRegistoPrimarioExamesAcesso(
  params: FetchRegistoPrimarioExamesAcessoParams
) {
  return useQuery<FetchRegistoPrimarioExamesAcessoResponse>({
    queryKey: [
      "registo-primario-exames-acesso",
      params.page,
      params.limit,
      params.anoLectivo,
      params.grau,
      params.search,
    ],
    queryFn: () => fetchRegistoPrimarioExamesAcessoService(params),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}