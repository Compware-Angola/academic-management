import { useQuery } from "@tanstack/react-query";
import {
  listarVagas,
  type ListarVagasParams,
  type ListarVagasResponse,
} from "@/services/access_exam/listar-vagas.service";

export function useListarVagas(params: ListarVagasParams) {
  return useQuery<ListarVagasResponse>({
    queryKey: ["vagas", params],
    queryFn: () => listarVagas(params),
  });
}
