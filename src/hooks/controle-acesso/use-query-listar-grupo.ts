import { useQuery } from "@tanstack/react-query";

import {
  listarGruposService,
  ListarGruposPayload,
} from "@/services/controle-acesso/listar-grupos.service";

export const useQueryListarGrupo = (filters: ListarGruposPayload) => {
  return useQuery({
    queryKey: ["grupo-acesso", filters],
    queryFn: () => listarGruposService(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  });
};
