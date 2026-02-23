// src/hooks/solicitacao/use-query-servicos.ts

import { ListarServicosPayload, listarServicosService, Servico } from "@/services/access/solicitacao/listar-servicos-solicitacao";
import { useQuery } from "@tanstack/react-query";

export function useQueryServicos(payload: ListarServicosPayload) {
  return useQuery<Servico[]>({
    queryKey: ["servicos", payload],
    queryFn: () => listarServicosService(payload),
    enabled: !!payload.codigo_ano_lectivo, // só executa se tiver ano lectivo
  });
}
