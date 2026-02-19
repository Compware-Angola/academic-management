
import { GenerateMesTempPayload, GenerateMesTempResponse, generateMesTempService } from "@/services/academiccalendar/generate-mes-temp.service";
import { useQuery } from "@tanstack/react-query";


export function useQueryGenerateMesTemp(payload: GenerateMesTempPayload,
  options?: { enabled?: boolean }) {
  return useQuery<GenerateMesTempResponse>({
    queryKey: ["generate-mes-temp", payload.anoLectivoId],
    queryFn: () => generateMesTempService(payload),
    enabled: options?.enabled ?? !!payload.anoLectivoId,
  });
}
