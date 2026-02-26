'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { httpClient } from '@/data/http/httpClient';

interface FormData {
  nome: string;
  tipo: string;
  formato: string;
  dataInicio: string;
  dataFim: string;
  vagasMaximas: number;
  status: string;
  descricao: string;
}

export default function NovoCadastroEventoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      tipo: 'Workshop',
      formato: 'Online',
      vagasMaximas: 30,
      status: 'Rascunho',
    },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...data,
        dataInicio: data.dataInicio ? new Date(data.dataInicio).toISOString() : '',
        dataFim: data.dataFim ? new Date(data.dataFim).toISOString() : '',
      };
      const res = await httpClient.post<{ id: string }>('/eventos', payload);
      router.push(`/eventos/${res.data.id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erro ao criar evento.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Novo evento
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                {...register('nome', { required: 'Nome obrigatório' })}
                label="Nome"
                error={!!errors.nome}
                helperText={errors.nome?.message}
                fullWidth
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  {...register('tipo', { required: true })}
                  select
                  SelectProps={{ native: true }}
                  label="Tipo"
                  fullWidth
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Mentoria">Mentoria</option>
                </TextField>
                <TextField
                  {...register('formato', { required: true })}
                  select
                  SelectProps={{ native: true }}
                  label="Formato"
                  fullWidth
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Online">Online</option>
                  <option value="Híbrido">Híbrido</option>
                </TextField>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  {...register('dataInicio', { required: 'Início obrigatório' })}
                  label="Data/hora início"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  {...register('dataFim', { required: 'Fim obrigatório' })}
                  label="Data/hora fim"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  {...register('vagasMaximas', { required: true, min: { value: 1, message: 'Mínimo 1' } })}
                  label="Vagas máximas"
                  type="number"
                  inputProps={{ min: 1 }}
                  fullWidth
                />
                <TextField
                  {...register('status', { required: true })}
                  select
                  SelectProps={{ native: true }}
                  label="Status"
                  fullWidth
                >
                  <option value="Rascunho">Rascunho</option>
                  <option value="Publicado">Publicado</option>
                  <option value="Arquivado">Arquivado</option>
                </TextField>
              </Box>
              <TextField
                {...register('descricao')}
                label="Descrição"
                multiline
                rows={4}
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button component={Link} href="/eventos">
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? <CircularProgress size={24} /> : 'Criar'}
                </Button>
              </Box>
              {error && <Typography color="error">{error}</Typography>}
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
