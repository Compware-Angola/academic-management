import { fetchFormasPagamento } from "@/services/forma-pagamentos/fetch-forma-pagamento.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryFormasPagamento = () => {
  return useQuery({
    queryKey: ["formas-pagamento"],
    queryFn: fetchFormasPagamento,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
