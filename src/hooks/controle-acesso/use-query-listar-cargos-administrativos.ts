import { useQuery } from "@tanstack/react-query";
import {
  listarCargosAdministrativoService,
  ListarCargosPayload,
} from "@/services/access/cargos-administrativos/fetch-cargos-administrativos.service";

export const useQueryListarCargosAdministrativo = (
  filters: ListarCargosPayload
) => {
  return useQuery({
    queryKey: ["cargos-administrativos", filters],
    queryFn: () => listarCargosAdministrativoService(filters),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
