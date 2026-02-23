// src/hooks/useQueryGenerateMesTemp.ts (ou onde estiveres a usar)

import { useQuery } from "@tanstack/react-query";
import { 
  GenerateMesTempPayload, 
  GenerateMesTempResponse, 
  generateMesTempService 
} from "@/services/academiccalendar/generate-mes-temp.service";

export function useQueryGenerateMesTemp(
  payload: GenerateMesTempPayload,
  options?: { enabled?: boolean }
) {
  return useQuery<GenerateMesTempResponse>({
  
    queryKey: [
      "generate-mes-temp", 
      payload.anoInicial, 
      payload.anoFinal
    ],
    
    // Função que chama o serviço atualizado
    queryFn: () => generateMesTempService(payload),
    
    // Ativa a query apenas quando ambos os anos estiverem definidos e forem válidos
    enabled: options?.enabled ?? (
      !!payload.anoInicial && 
      !!payload.anoFinal && 
      Number.isInteger(payload.anoInicial) && 
      Number.isInteger(payload.anoFinal) && 
      payload.anoFinal > payload.anoInicial
    ),
    
    // Opcional: configurações úteis para este tipo de query
    staleTime: 5 * 60 * 1000,      // 5 minutos – evita refetch desnecessário
    gcTime: 10 * 60 * 1000,         // 10 minutos de garbage collection
    retry: 1,                       // tenta 1 vez em caso de falha
  });
}