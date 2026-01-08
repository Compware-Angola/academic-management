import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginService,
  getCurrentUserService,
  type LoginPayload,
  type AuthResponse,
  type CurrentUserResponse,
} from "@/services/auth/login.service";
import { AuthStorage } from "@/util/auth-storage";
import { useNavigate } from "react-router-dom";
import { useToast } from "../use-toast";

export function useMutationLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationKey: ["login"],
    mutationFn: loginService,
    onSuccess: async (data) => {
      AuthStorage.saveLogin(data);
      toast({
        title: data.mensagem || "Login realizado com sucesso",
        description: `Bem-vindo, ${data.user.username ?? "Utilizador"}`,
      });
      navigate("/dashboard", { replace: true });
      await queryClient.resetQueries({
        queryKey: ["current-user"],
      });
    },
    onError: (err: Error) => {
      const message =
        err.message || "Erro ao autenticar. Verifique credenciais.";
      toast({
        title: "Erro ao fazer login",
        description: message,
        variant: "destructive",
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
