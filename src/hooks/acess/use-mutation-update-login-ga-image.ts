import {
  getGAImage,
  updateLoginGaImage,
} from "@/services/access/solicitacao/update-login-ga-image.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useMutationUpdateLoginGaImage() {
  return useMutation({
    mutationFn: updateLoginGaImage,
  });
}

export function useGetGAImage() {
  return useQuery({
    queryKey: ["portal-student-image"],
    queryFn: getGAImage,
  });
}
