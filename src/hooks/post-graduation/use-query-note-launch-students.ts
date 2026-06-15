import { useQuery } from "@tanstack/react-query";

import {
  fetchNoteLaunchStudents,
  type FetchNoteLaunchStudentsParams,
  type FetchNoteLaunchStudentsResponse,
} from "@/services/post-graduation/fetch-note-launch-students.service";

export const POST_GRADUATION_NOTE_LAUNCH_STUDENTS_QUERY_KEY =
  "post-graduation-note-launch-students";

export function useQueryNoteLaunchStudents(
  params: FetchNoteLaunchStudentsParams,
) {
  const enabled =
    params.academicYearId > 0 &&
    [2, 3].includes(params.degreeId) &&
    [1, 2].includes(params.semesterId) &&
    params.periodId > 0 &&
    params.courseId > 0 &&
    params.curricularYearId > 0 &&
    params.curricularGradeId > 0 &&
    params.scheduleId > 0 &&
    params.examTypeId > 0 &&
    params.assessmentTypeId > 0;

  return useQuery<FetchNoteLaunchStudentsResponse>({
    queryKey: [
      POST_GRADUATION_NOTE_LAUNCH_STUDENTS_QUERY_KEY,
      params.academicYearId,
      params.degreeId,
      params.semesterId,
      params.periodId,
      params.courseId,
      params.curricularYearId,
      params.curricularGradeId,
      params.scheduleId,
      params.examTypeId,
      params.assessmentTypeId,
      params.search ?? "",
      params.page,
      params.limit,
    ],
    queryFn: () => fetchNoteLaunchStudents(params),
    enabled,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });
}