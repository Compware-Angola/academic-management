import { AuthResponse } from "@/services/auth/login.service";

export class AuthStorage {
  private static TOKEN_KEY = "auth.token";

  static saveLogin(data: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, data.access_token);
  }

  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
