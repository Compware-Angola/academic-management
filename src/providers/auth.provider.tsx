import { AuthContext } from "@/context/auth.context";
import {
  AuthResponse,
  getCurrentUserService,
  LoginPayload,
} from "@/services/auth/login.service";
import { AuthStorage } from "@/util/auth-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(AuthStorage.getToken());
  localStorage.removeItem("auth.user");
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["current-user", "GA"],
    queryFn: () => getCurrentUserService("GA"),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && isError) {
      AuthStorage.logout();
      setToken(null);
      queryClient.clear();
    }
  }, [isError, navigate, queryClient, isLoading]);

  const login = (payload: AuthResponse) => {
    AuthStorage.saveLogin(payload);
    setToken(token);
    queryClient.invalidateQueries({ queryKey: ["current-user", "GA"] });
    console.log("aqui");
  };

  const logout = () => {
    AuthStorage.logout();
    setToken(null);
    queryClient.clear();
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ user: user ?? null, token, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
