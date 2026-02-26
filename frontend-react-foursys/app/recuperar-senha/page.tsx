'use client';

import { useState } from 'react';
import { Box, Card, CardContent, CardHeader, TextField, Button, Typography } from '@mui/material';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { httpClient } from '@/data/http/httpClient';

interface FormData {
  email: string;
}

export default function RecuperarSenhaPage() {
  const [enviado, setEnviado] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await httpClient.post('/auth/recuperar-senha', { email: data.email });
    setEnviado(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Card sx={{ maxWidth: 420 }}>
        <CardHeader title="Recuperar senha" subheader="Informe seu e-mail para receber o link de redefinição" />
        <CardContent>
          {enviado ? (
            <Typography color="success.main">
              Se o e-mail existir em nossa base, você receberá um link para redefinir sua senha.
            </Typography>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('email', {
                  required: 'E-mail obrigatório',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'E-mail inválido' },
                })}
                label="E-mail"
                type="email"
                fullWidth
                sx={{ mb: 2 }}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                <Button component={Link} href="/login">Voltar</Button>
                <Button type="submit" variant="contained" color="primary">
                  Enviar
                </Button>
              </Box>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
