import {
  ChangeCoursePayload,
  changeStudentCourse,
} from "@/services/students/update-change-course.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutationChangeStudentCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangeCoursePayload) => changeStudentCourse(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["student-course"],
      });
    },
  });
};
