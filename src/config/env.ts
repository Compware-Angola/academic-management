// src/config/env.ts
const rawEnv = import.meta.env.VITE_APP_ENV as string | undefined;

if (!rawEnv) {
  console.warn('VITE_APP_ENV não definida → usando fallback "unknown"');
}

export const APP_ENV = rawEnv ?? 'unknown';

export const isDevelop = APP_ENV === 'development';
export const isPrePrd  = APP_ENV === 'pre-prd';
export const isPrd     = APP_ENV === 'prd';

// Opcional: para badge em ambientes não-produção
export const isNonProd = isDevelop || isPrePrd;