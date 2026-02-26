/**
 * Cache em memória para requisições GET em modo mock.
 * Reduz latência ao navegar entre telas já visitadas.
 */
const cache = new Map<string, { data: unknown; timestamp: number }>();
const TTL_MS = 5 * 60 * 1000; // 5 minutos

function cacheKey(method: string, url: string): string {
  return `${method}:${url}`;
}

export function getCached<T>(method: string, url: string): T | null {
  if (method !== 'GET') return null;
  const key = cacheKey(method, url);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache(method: string, url: string, data: unknown): void {
  if (method !== 'GET') return;
  cache.set(cacheKey(method, url), { data, timestamp: Date.now() });
}

export function clearCache(): void {
  cache.clear();
}
