import {
  UpdateAssessmentParametersNotePayload,
  updateAssessmentParametersNoteService,
} from "@/services/avaliacao/update-assessment-parameter-note.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutationUpdateAssessmentParametersNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      parametroId,
      payload,
    }: {
      parametroId: number | string;
      payload: UpdateAssessmentParametersNotePayload;
    }) =>
      updateAssessmentParametersNoteService({
        parametroId,
        payload,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assessment-parameters-note"],
      });
    },
  });
};
