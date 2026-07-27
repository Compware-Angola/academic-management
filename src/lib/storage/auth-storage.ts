// src/lib/storage/auth-storage.ts
type AuthData = {
  token: string
  user_id: number
  user_name: string
  codigoPreinscricao: number
}

const STORAGE_KEY = '@academico:auth'
export const AuthStorage = {
  /**
   * Salva os dados de autenticação no localStorage.
   * @param data Dados de autenticação retornados pela API.
   */
  save(data: AuthData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Erro ao salvar dados de autenticação:', error)
    }
  },

  /**
   * Retorna os dados de autenticação armazenados.
   * @returns {AuthData | null}
   */
  get(): AuthData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as AuthData) : null
    } catch (error) {
      console.error('Erro ao ler dados de autenticação:', error)
      return null
    }
  },

  /**
   * Retorna apenas o token salvo (caso exista).
   */
  getToken(): string | null {
    return this.get()?.token ?? null
  },

  /**
   * Remove completamente os dados de autenticação.
   */
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Erro ao limpar autenticação:', error)
    }
  },

  isAuthenticated(): boolean {
    const auth = this.get()
    return !!auth?.token
  },
}
