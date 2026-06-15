import { updateLoginGaImage } from "@/services/access/solicitacao/update-login-ga-image.service";
import { useMutation } from "@tanstack/react-query";

export function useMutationUpdateLoginGaImage() {
  return useMutation({
    mutationFn: updateLoginGaImage,
  });
}
