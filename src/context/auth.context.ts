import {
  AuthResponse,
  CurrentUserResponse,
} from "@/services/auth/login.service";
import { createContext } from "react";

export type AuthContextType = {
  user: CurrentUserResponse | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: AuthResponse) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
