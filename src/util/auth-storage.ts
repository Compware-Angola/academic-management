export type AuthUser = {
  user_id: string;
  username: string;
  hash: string;
};

export type AuthResponse = {
  codresposta: number;
  msgresposta: string;
  token: string;
  user_id: string;
  hash: string;
  username: string;
};

export class AuthStorage {
  private static TOKEN_KEY = "auth.token";
  private static USER_KEY = "auth.user";

  // Salvar informação completa do login
  static saveLogin(data: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, data.token);

    const user: AuthUser = {
      user_id: data.user_id,
      username: data.username,
      hash: data.hash,
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
