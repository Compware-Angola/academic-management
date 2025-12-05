
import { fetchTeacherProfile, TeacherProfile } from "@/services/teacher/fetch-profile";
import { useQuery } from "@tanstack/react-query";

export function useQueryTeacherProfile(teacherId?: number) {
  return useQuery<TeacherProfile | null, Error>({
    queryKey: ["teacher-profile", teacherId],
    queryFn: () => fetchTeacherProfile(teacherId!),
    enabled: !!teacherId, 
  });
}

