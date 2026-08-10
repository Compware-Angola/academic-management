import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getComunicadoPortalImage,
  updateComunicadoPortalImage,
} from "@/services/access/solicitacao/update-comunicado-portal-image.service";

export function useMutationUpdateComunicadoPortalImage() {
  return useMutation({
    mutationFn: updateComunicadoPortalImage,
  });
}

export function useGetPortalStudentImage() {
  return useQuery({
    queryKey: ["portal-student-image"],
    queryFn: getComunicadoPortalImage,
  });
}
