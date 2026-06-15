import { useMutation } from "@tanstack/react-query";
import { updateComunicadoPortalImage } from "@/services/access/solicitacao/update-comunicado-portal-image.service";

export function useMutationUpdateComunicadoPortalImage() {
  return useMutation({
    mutationFn: updateComunicadoPortalImage,
  });
}
