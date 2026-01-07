import { AuthStorage } from "@/util/auth-storage";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "./mutations/use-mutation-login";

export const useAuth = () => {
  const navigate = useNavigate();
  const logout = () => {
    AuthStorage.logout();
    navigate("/");
  };
  
  const isAuthenticated = AuthStorage.isAuthenticated();
  const { data: user,isError } = useCurrentUser('GA');
  if (isError) {
    logout();
  }
  const token = AuthStorage.getToken();
  return {
    user,
    token,
    isAuthenticated,
    logout,
  };
};
