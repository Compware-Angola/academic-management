import { AuthStorage } from "@/util/auth-storage";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const logout = () => {
    AuthStorage.logout();
    navigate("/");
  };
  const isAuthenticated = AuthStorage.isAuthenticated();
  const user = AuthStorage.getUser();
  const token = AuthStorage.getToken();
  return {
    user,
    token,
    isAuthenticated,
    logout,
  };
};
