import { useQuery } from "@tanstack/react-query";
import { getLoginGaImage } from "@/services/access/solicitacao/get-login-ga-image.service";

export function useQueryLoginGaImage() {
  return useQuery({
    queryKey: ["aviso-imagem", "LOGIN_GA"],
    queryFn: getLoginGaImage,
    retry: false,
  });
}
