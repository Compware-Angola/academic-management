import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginService,
  getCurrentUserService,
  type LoginPayload,
  type AuthResponse,

  logout,

  logoutResponse,
  makLoggedOut,
  
} from "@/services/auth/login.service";
import { AuthStorage } from "@/util/auth-storage";
import { useNavigate } from "react-router-dom";
import { useToast } from "../use-toast";
import { useAuth } from "../use-auth";

export function useMutationLogin() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationKey: ["login"],
    mutationFn: loginService,
    onSuccess: (data) => {
      login(data);

      toast({
        title: data.mensagem || "Login realizado com sucesso",
        description: `Bem-vindo, ${data.user.username ?? "Utilizador"}`,
      });

      navigate("/dashboard", { replace: true });
    },
    onError: (err: Error) => {
      toast({
        title: "Erro ao fazer login",
        description:
          err.message || "Erro ao autenticar. Verifique credenciais.",
        variant: "destructive",
      });
    },
  });
}
export function useMutationLogout() {
  const { logout: authLogout } = useAuth(); 
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();   

  return useMutation<logoutResponse, Error, { platform: 'GA' }>({
    mutationKey: ["logout"],
    mutationFn: logout,

    onSuccess: (data) => {
      // Limpa a sessão / auth state
      authLogout(); 
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['users-logados'] });

      toast({
        title: "Logout realizado",
        description: data.mensagem || "Sessão terminada com sucesso.",
      });

      navigate("/", { replace: true }); 
    },

    onError: (err: Error) => {
      toast({
        title: "Erro ao terminar sessão",
        description: err.message || "Não foi possível fazer logout. Tente novamente.",
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
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}




export function useMutationMakLoggedOut() {

  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    logoutResponse,
    Error,
    { utilizadorId: number | string; platform: "GA" }
  >({
    mutationKey: ["mak-logged-out"],

    mutationFn: ({ utilizadorId, platform }) =>
      makLoggedOut(utilizadorId, platform),

    onSuccess: (data) => {
  
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["users-logados"] });

      toast({
        title: "Logout realizado",
        description: data.mensagem ?? "Sessão terminada com sucesso.",
      });
    },

    onError: (err: Error) => {
      toast({
        title: "Erro ao terminar sessão",
        description:
          err.message || "Não foi possível fazer logout. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}
