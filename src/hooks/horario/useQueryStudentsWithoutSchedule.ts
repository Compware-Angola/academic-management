
import { fetchStudentsWithoutSchedule,ScheduleParams } from "@/services/horario/fetch-student-witiout-schedule.service"
import { useQuery } from "@tanstack/react-query"

export const useQueryStudentsWithoutSchedule = (
  params: ScheduleParams,
) => {
  return useQuery({
    queryKey: ["students-without-schedule", params],
    queryFn: () => fetchStudentsWithoutSchedule(params),
    staleTime: 5 * 60 * 1000,
 })
}
