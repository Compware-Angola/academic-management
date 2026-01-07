import {
  GetAssessmentParametersNotePayload,
  GetAssessmentParametersNoteResponse,
  getAssessmentParametersNoteService,
} from "@/services/avaliacao/fetch-assessment-parameter-note.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryAssessmentParametersNote = (
  payload: GetAssessmentParametersNotePayload,
  options?: {
    enabled?: boolean;
  }
) => {
  const enabled =
    typeof options?.enabled === "boolean" ? options.enabled : true;

  return useQuery<GetAssessmentParametersNoteResponse>({
    queryKey: ["assessment-parameters-note", payload],
    queryFn: () => getAssessmentParametersNoteService(payload),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
