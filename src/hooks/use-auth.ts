import { AuthStorage } from "@/util/auth-storage";

export const useAuth = () => {
  return {
    user: AuthStorage.getUser(),
    token: AuthStorage.getToken(),
    isAuthenticated: AuthStorage.isAuthenticated(),
    logout: AuthStorage.logout,
  };
};
