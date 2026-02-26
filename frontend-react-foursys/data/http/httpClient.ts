import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getTraceId } from '@/shared/utils/traceId';
import { API_BASE_URL, TOKEN_KEY } from '@/shared/constants/api';
import { getCached, setCache } from './apiCache';

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const isMockMode = () =>
  typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MOCK === '1';

function createHttpClient(config?: AxiosRequestConfig): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Frontend-Trace-Id': getTraceId(),
    },
    ...config,
  });

  client.interceptors.request.use((req) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    req.headers['X-Frontend-Trace-Id'] = getTraceId();

    // Em modo mock: usa cache para GET - resposta instantânea ao re-visitar telas
    if (isMockMode() && req.method?.toUpperCase() === 'GET') {
      const url = (req.baseURL || '') + (req.url || '');
      const cached = getCached<unknown>(req.method, url);
      if (cached !== null) {
        req.adapter = () =>
          Promise.resolve({
            data: cached,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: req,
          });
      }
    }
    return req;
  });

  client.interceptors.response.use(
    (res) => {
      // Em modo mock: armazena GET no cache
      if (isMockMode() && res.config.method?.toUpperCase() === 'GET') {
        const url = (res.config.baseURL || '') + (res.config.url || '');
        setCache(res.config.method, url, res.data);
      }
      return res;
    },
    (err) => {
      if (err.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY);
          window.location.href = '/login';
        }
      }
      return Promise.reject(err);
    }
  );

  return client;
}

export const httpClient = createHttpClient();
