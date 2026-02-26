'use client';

import { Box, Card, CardContent, CardHeader, TextField, Button } from '@mui/material';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

interface FormData {
  token: string;
  senha: string;
  confirmarSenha: string;
}

export default function ResetarSenhaPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const senha = watch('senha');

  const onSubmit = (data: FormData) => {
    console.log('Resetar senha:', data);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Card sx={{ maxWidth: 420 }}>
        <CardHeader title="Resetar senha" subheader="Informe o token recebido por e-mail e a nova senha" />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('token', { required: 'Token obrigatório' })}
              label="Token"
              fullWidth
              sx={{ mb: 2 }}
              error={!!errors.token}
              helperText={errors.token?.message}
            />
            <TextField
              {...register('senha', {
                required: 'Nova senha obrigatória',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' },
              })}
              label="Nova senha"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              error={!!errors.senha}
              helperText={errors.senha?.message}
            />
            <TextField
              {...register('confirmarSenha', {
                required: 'Confirme a senha',
                validate: (v) => v === senha || 'Senhas não coincidem',
              })}
              label="Confirmar senha"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              error={!!errors.confirmarSenha}
              helperText={errors.confirmarSenha?.message}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', mt: 2 }}>
              <Button component={Link} href="/login">
                Voltar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Resetar senha
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
