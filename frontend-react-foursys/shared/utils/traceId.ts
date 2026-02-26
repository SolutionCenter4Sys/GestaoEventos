const TRACE_ID_KEY = 'frontend_trace_id';

export function generateTraceId(): string {
  const id = `fe-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(TRACE_ID_KEY, id);
  }
  return id;
}

export function getTraceId(): string {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem(TRACE_ID_KEY) || generateTraceId();
}
