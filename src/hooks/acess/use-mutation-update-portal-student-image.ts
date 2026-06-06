import { useMutation } from "@tanstack/react-query";
import { updatePortalStudentImage } from "@/services/access/solicitacao/update-portal-student-image.service";

export function useMutationUpdatePortalStudentImage() {
  return useMutation({
    mutationFn: updatePortalStudentImage,
  });
}
