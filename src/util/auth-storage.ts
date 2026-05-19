import { AuthResponse } from "@/services/auth/login.service";

export class AuthStorage {
  private static TOKEN_KEY = "auth.token";
  private static OPENING_CODE_VERIFIED_KEY = "opening-code.verified";

  static saveLogin(data: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, data.access_token);
  }

  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.OPENING_CODE_VERIFIED_KEY);
  }

  static saveOpeningCodeVerified() {
    localStorage.setItem(this.OPENING_CODE_VERIFIED_KEY, "true");
  }

  static isOpeningCodeVerified() {
    return !!localStorage.getItem(this.OPENING_CODE_VERIFIED_KEY);
  }
  static removeOpeningCodeVerified() {
    localStorage.removeItem(this.OPENING_CODE_VERIFIED_KEY);
  }
}
