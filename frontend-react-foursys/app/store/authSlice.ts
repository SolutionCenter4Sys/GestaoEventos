import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { httpClient } from '@/data/http/httpClient';
import type { User, LoginResponse } from '@/shared/types/auth';
import { TOKEN_KEY, USER_KEY } from '@/shared/constants/api';

const loadStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  try {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch {
    return null;
  }
};

export const login = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await httpClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return res.data;
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Falha no login. Verifique e-mail e senha.';
    return rejectWithValue(message);
  }
});

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: loadStoredUser(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (!action.payload.requiresTwoFactor && action.payload.access_token) {
          state.user = action.payload.user;
          if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, action.payload.access_token);
            if (action.payload.user) {
              localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
            }
          }
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Erro ao fazer login';
      });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
