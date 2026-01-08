import { AuthResponse } from "@/services/auth/login.service";

export class AuthStorage {
  private static TOKEN_KEY = "auth.token";

  // Salvar informação completa do login
  static saveLogin(data: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, data.access_token);
  }

  // Buscar token
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Verifica se está autenticado
  static isAuthenticated(): boolean {
    const isAuthenticated = !!this.getToken();
    if (!isAuthenticated) {
      this.logout();
    }
    return isAuthenticated;
  }

  // Limpar tudo
  static logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
