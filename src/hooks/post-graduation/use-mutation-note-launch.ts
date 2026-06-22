import { upsertPostGraduationNotes } from "@/services/post-graduation/upsert-note-launch.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { POST_GRADUATION_NOTE_LAUNCH_STUDENTS_QUERY_KEY } from "./use-query-note-launch-students";

export function useMutationPostGraduationNoteLaunch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertPostGraduationNotes,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          POST_GRADUATION_NOTE_LAUNCH_STUDENTS_QUERY_KEY,
        ],
      });
    },
  });
}