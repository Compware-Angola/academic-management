import { fetchStateLesson, LessonState } from "@/services/fetch-lesson-state.service";
import { useQuery } from "@tanstack/react-query";

export function useQueryStateLesson() {
  return useQuery<LessonState[], Error>({
    queryKey: ["teachers"],
    queryFn: fetchStateLesson,
   staleTime: 5 * 60 * 1000,

  });
}
