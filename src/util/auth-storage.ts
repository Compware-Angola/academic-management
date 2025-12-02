import { AuthResponse } from "@/services/auth/login.service";

export type AuthUser = {
  user_id: string;
  username: string;
  expires_in: string;
};

export class AuthStorage {
  private static TOKEN_KEY = "auth.token";
  private static USER_KEY = "auth.user";

  // Salvar informação completa do login
  static saveLogin(data: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, data.access_token);

    const user: AuthUser = {
      user_id: data.user.pk_utilizador  + "",
      username: data.user.username,
      expires_in: data.expires_in + "",
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Buscar token
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Buscar dados do usuário
  static getUser(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  // Verifica se está autenticado
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Limpar tudo
  static logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
