import {
  GetStudentMovementsParams,
  StudentMovementsResponse,
  getStudentMovements,
} from "@/services/students/fetch-students-movimnets.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryStudentMovements = (params: GetStudentMovementsParams) => {
  return useQuery<StudentMovementsResponse>({
    queryKey: ["student-movements", params],
    queryFn: () => getStudentMovements(params),
    staleTime: 1000 * 60 * 5,
  });
};
