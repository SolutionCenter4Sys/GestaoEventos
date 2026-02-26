'use client';

import { useState, useEffect } from 'react';
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
import { httpClient } from '@/data/http/httpClient';
import { TOKEN_KEY, USER_KEY } from '@/shared/constants/api';

interface FormData {
  code: string;
}

export default function Config2faPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [modoConfiguracao, setModoConfiguracao] = useState(true);

  useEffect(() => {
    const verify = (window as unknown as { __2FA_VERIFY__?: boolean }).__2FA_VERIFY__;
    setModoConfiguracao(!verify);
    if (!verify) {
      httpClient.get<{ qrCodeUrl?: string }>('/auth/2fa/setup').then(
        (res) => setQrCodeUrl(res.data.qrCodeUrl || null),
        () => {}
      );
    }
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await httpClient.post<{ access_token: string; user: unknown }>('/auth/2fa/verify', {
        code: data.code,
      });
      if (res.data.access_token && typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, res.data.access_token);
        if (res.data.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        }
        router.replace('/dashboard');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Código inválido.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
      <Card>
        <CardHeader
          title="Autenticação em dois fatores (2FA)"
          subheader={
            modoConfiguracao
              ? 'Escaneie o QR code no app e insira o código gerado'
              : 'Insira o código do seu aplicativo autenticador'
          }
        />
        <CardContent>
          {modoConfiguracao && qrCodeUrl && (
            <Box sx={{ textAlign: 'center', my: 2 }}>
              <img src={qrCodeUrl} alt="QR Code 2FA" style={{ maxWidth: 200 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Guarde os códigos de recuperação em local seguro.
              </Typography>
            </Box>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('code', {
                required: 'Código obrigatório',
                minLength: { value: 6, message: 'Informe 6 dígitos' },
                maxLength: { value: 6, message: 'Máximo 6 dígitos' },
              })}
              label="Código de 6 dígitos"
              placeholder="000000"
              inputProps={{ maxLength: 6 }}
              error={!!errors.code}
              helperText={errors.code?.message}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              {modoConfiguracao && (
                <Button component={Link} href="/dashboard">
                  Cancelar
                </Button>
              )}
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : modoConfiguracao ? 'Ativar 2FA' : 'Verificar'}
              </Button>
            </Box>
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
