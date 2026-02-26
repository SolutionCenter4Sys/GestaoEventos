'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { validarCPF, mascaraCPF, mascaraTelefone } from '@/shared/utils/validators';
import { httpClient } from '@/data/http/httpClient';

interface FormData {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
}

export default function InscricaoPage() {
  const params = useParams();
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const eventoId = params.eventoId as string;
  const [nomeEvento, setNomeEvento] = useState('Carregando...');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (eventoId) {
      httpClient.get<{ nome?: string }>(`/eventos/${eventoId}`).then(
        (res) => setNomeEvento(res.data.nome || 'Evento'),
        () => setNomeEvento('Evento')
      );
    }
  }, [eventoId]);

  const validateCPF = (v: string) => {
    const nums = v.replace(/\D/g, '');
    if (nums.length < 11) return 'CPF deve ter 11 dígitos';
    return validarCPF(v) || 'CPF inválido (dígitos verificadores)';
  };

  const onSubmit = async (data: FormData) => {
    if (!eventoId) {
      setError('Evento não identificado.');
      return;
    }
    if (!executeRecaptcha) {
      setError('reCAPTCHA não carregado. Tente novamente.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const recaptchaToken = await executeRecaptcha('inscricao');
      await httpClient.post(`/eventos/${eventoId}/inscricoes`, {
        ...data,
        cpf: data.cpf.replace(/\D/g, ''),
        telefone: data.telefone.replace(/\D/g, ''),
        recaptchaToken,
      });
      router.push('/inscricao-confirmada');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erro ao inscrever. Tente novamente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
      <Card>
        <CardHeader title="Inscrição no evento" subheader={nomeEvento} />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                {...register('nome', { required: 'Nome obrigatório' })}
                label="Nome completo"
                error={!!errors.nome}
                helperText={errors.nome?.message}
                fullWidth
              />
              <TextField
                {...register('email', {
                  required: 'E-mail obrigatório',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'E-mail inválido' },
                })}
                label="E-mail"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />
              <Controller
                name="cpf"
                control={control}
                rules={{
                  required: 'CPF obrigatório',
                  validate: validateCPF,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="CPF"
                    placeholder="000.000.000-00"
                    inputProps={{ maxLength: 14 }}
                    onChange={(e) => field.onChange(mascaraCPF(e.target.value))}
                    error={!!errors.cpf}
                    helperText={errors.cpf?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="telefone"
                control={control}
                rules={{
                  required: 'Telefone obrigatório',
                  minLength: { value: 10, message: 'Telefone inválido' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Telefone"
                    placeholder="(00) 00000-0000"
                    inputProps={{ maxLength: 15 }}
                    onChange={(e) => field.onChange(mascaraTelefone(e.target.value))}
                    error={!!errors.telefone}
                    helperText={errors.telefone?.message}
                    fullWidth
                  />
                )}
              />
              <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }}>
                {loading ? 'Enviando...' : 'Confirmar inscrição'}
              </Button>
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
