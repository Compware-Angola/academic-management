

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
    mutationFn: (payload: LoginPayload) => loginService(payload),
    onSuccess: (data) => {
      AuthStorage.saveLogin(data);
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
}

export function useCurrentUser(platform: "GA" ) {
  return useQuery({
    queryKey: ["current-user", platform],
    queryFn: () => getCurrentUserService(platform),
    enabled: AuthStorage.isAuthenticated(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    
  });
}