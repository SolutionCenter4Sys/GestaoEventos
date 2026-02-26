'use client';

import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '@/hooks/useAppSelector';
import { httpClient } from '@/data/http/httpClient';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  senhaAtual?: string;
  novaSenha?: string;
  confirmarSenha?: string;
}

export default function MeusDadosPrivacidadePage() {
  const user = useAppSelector((s) => s.auth.user);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { nome: user?.name || '', email: user?.email || '', telefone: '' },
  });

  const novaSenha = watch('novaSenha');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await httpClient.put('/meus-dados', {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        ...(data.senhaAtual && data.novaSenha
          ? { senhaAtual: data.senhaAtual, novaSenha: data.novaSenha }
          : {}),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Meus Dados e Privacidade
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                {...register('nome', { required: 'Nome obrigatório' })}
                label="Nome"
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
              <TextField
                {...register('telefone', { required: 'Telefone obrigatório' })}
                label="Telefone"
                fullWidth
              />
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Alterar senha (opcional)
              </Typography>
              <TextField
                {...register('senhaAtual')}
                label="Senha atual"
                type="password"
                fullWidth
              />
              <TextField
                {...register('novaSenha', {
                  minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                })}
                label="Nova senha"
                type="password"
                error={!!errors.novaSenha}
                helperText={errors.novaSenha?.message}
                fullWidth
              />
              <TextField
                {...register('confirmarSenha', {
                  validate: (v) => !novaSenha || v === novaSenha || 'Senhas não coincidem',
                })}
                label="Confirmar nova senha"
                type="password"
                error={!!errors.confirmarSenha}
                helperText={errors.confirmarSenha?.message}
                fullWidth
              />
              <Button type="submit" variant="contained" disabled={loading}>
                Salvar
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
