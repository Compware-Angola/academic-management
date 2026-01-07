

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginService,
  getCurrentUserService,
  type LoginPayload,
  type AuthResponse,
  type CurrentUserResponse,
} from "@/services/auth/login.service";
import { AuthStorage } from "@/util/auth-storage";

export function useMutationLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationKey: ["login"],
    mutationFn: loginService,
    onSuccess: async (data) => {
      AuthStorage.saveLogin(data);

      // 🔐 garante que o token já existe
      await queryClient.resetQueries({
        queryKey: ["current-user"],
      });
    },
  });
}

export function useCurrentUser(platform: "GA") {
  const token = AuthStorage.getToken();

  return useQuery({
    queryKey: ["current-user", platform],
    queryFn: () => getCurrentUserService(platform),
    enabled: !!token, 
    staleTime: 5 * 60 * 1000,
    retry: false, 
  });
}
