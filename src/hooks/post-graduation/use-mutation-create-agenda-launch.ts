import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import {
  createPostGraduationAgendaLaunch,
  CreatePostGraduationAgendaLaunchPayload,
} from "@/services/post-graduation/create-agenda-launch.service";
import { POST_GRADUATION_AGENDA_LAUNCH_OPTIONS_QUERY_KEY } from "./use-query-agenda-launch-options";
import { POST_GRADUATION_AGENDA_LAUNCHES_QUERY_KEY } from "./use-query-agenda-launches";

export function useMutationCreateAgendaLaunch() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreatePostGraduationAgendaLaunchPayload) =>
      createPostGraduationAgendaLaunch(payload),
    onSuccess: async (response) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [POST_GRADUATION_AGENDA_LAUNCHES_QUERY_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: [POST_GRADUATION_AGENDA_LAUNCH_OPTIONS_QUERY_KEY],
        }),
      ]);

      toast({ title: response.message });
    },
  });
}
