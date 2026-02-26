/**
 * Em modo mock (NEXT_PUBLIC_MOCK=1), usa a mesma origem do frontend para que
 * as rotas /api do Next.js retornem dados mock sem precisar do backend.
 */
export const API_BASE_URL =
  (typeof window !== 'undefined' && (window as unknown as { __API_URL__?: string }).__API_URL__) ||
  (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MOCK === '1'
    ? `${window.location.origin}/api`
    : 'http://localhost:3000/api');

export const TOKEN_KEY = 'access_token';
export const USER_KEY = 'user';
