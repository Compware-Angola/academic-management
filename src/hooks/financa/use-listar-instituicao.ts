// hooks/financa/use-list-instituicao-tipo.ts

import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { InstituicaoTipo, listInstituicaoTipo } from "@/services/finance/listar-instituicao.service";

export function useListInstituicaoTipo() {
  const { toast } = useToast();

  return useQuery<InstituicaoTipo[]>({
    queryKey: ["instituicao-tipo"],
    queryFn: listInstituicaoTipo,

    staleTime: 1000 * 60 * 10, // lookup data
    retry: 1,
  });
}
