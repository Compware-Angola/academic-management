import { useMutation } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";
import {
  getPortalStudentImage,
  updatePortalStudentImage,
} from "@/services/access/solicitacao/update-portal-student-image.service";

export function useMutationUpdatePortalStudentImage() {
  return useMutation({
    mutationFn: updatePortalStudentImage,
  });
}

export function useGetPortalStudentImage() {
  return useQuery({
    queryKey: ["portal-student-image"],
    queryFn: getPortalStudentImage,
  });
}
