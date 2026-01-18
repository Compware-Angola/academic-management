import { useQuery } from "@tanstack/react-query";
import {
  InstituicaoTipo,
  listInstituicaoTipo,
} from "@/services/finance/listar-instituicao.service";

export function useListInstituicaoTipo() {
  return useQuery<InstituicaoTipo[]>({
    queryKey: ["instituicao-tipo"],
    queryFn: listInstituicaoTipo,

    staleTime: 1000 * 60 * 10,
    retry: 0,
  });
}
