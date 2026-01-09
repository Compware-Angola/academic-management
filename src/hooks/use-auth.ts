import { AuthStorage } from "@/util/auth-storage";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "./mutations/use-mutation-login";
import { useContext } from "react";
import { AuthContext } from "@/context/auth.context";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
