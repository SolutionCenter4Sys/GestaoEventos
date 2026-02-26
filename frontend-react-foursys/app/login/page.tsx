'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { login } from '@/store/authSlice';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const onSubmit = async (data: LoginForm) => {
    const result = await dispatch(login({ email: data.email, password: data.password }));
    if (login.fulfilled.match(result)) {
      const payload = result.payload;
      if (payload.requiresTwoFactor) {
        router.push('/config-2fa');
      } else {
        router.replace('/dashboard');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        p: 3,
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ maxWidth: 420, width: '100%' }}>
        <CardHeader
          title="Entrar"
          subheader="Plataforma de Gestão de Eventos"
        />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                {...register('email', {
                  required: 'E-mail obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'E-mail inválido',
                  },
                })}
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                variant="outlined"
              />
              <TextField
                {...register('password', {
                  required: 'Senha obrigatória',
                  minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                })}
                label="Senha"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                variant="outlined"
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Button component={Link} href="/recuperar-senha" color="primary" size="small">
                  Esqueci a senha
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
                </Button>
              </Box>
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>
      <Typography variant="body2" component="footer">
        <Link href="/politica-privacidade" style={{ color: '#3b82f6', textDecoration: 'none' }}>
          Política de Privacidade
        </Link>
      </Typography>
    </Box>
  );
}
