import { fetchTeacherClassCalendar, FetchTeacherClassCalendarParams } from "@/services/assiduidade/fetch-teacher-class-lesson-calendar.service";
import { useQuery } from "@tanstack/react-query";


export function useQueryTeacherClassCalendar(
  params: FetchTeacherClassCalendarParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["teacher-class-calendar", params],
    queryFn: () => fetchTeacherClassCalendar(params),
    enabled: options?.enabled ?? true,
  });
}