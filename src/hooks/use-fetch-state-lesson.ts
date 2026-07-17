import { fetchStateLesson, LessonState } from "@/services/fetch-lesson-state.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryStateLesson(options?: { enabled?: boolean }) {
  return useQuery<LessonState[], Error>({
    queryKey: ["lesson-state"],
    queryFn: fetchStateLesson,
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,

  });
}
