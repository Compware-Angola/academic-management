import { useMutation } from "@tanstack/react-query";
import { loginService, type LoginPayload } from "@/services/auth/login.service";
import { AuthStorage } from "@/util/auth-storage";

export function useMutationLogin() {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (payload: LoginPayload) => loginService(payload),
    onSuccess: (data) => {
      AuthStorage.saveLogin(data);
    },
  });
}
