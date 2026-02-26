'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

function toDatetimeLocal(value?: string): string {
  if (!value) return '';
  return value.replace('Z', '').slice(0, 16);
}

export default function EditarEventoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    if (id) {
      httpClient.get<FormData>(`/eventos/${id}`).then(
        (res) => {
          reset({
            ...res.data,
            dataInicio: toDatetimeLocal(res.data.dataInicio),
            dataFim: toDatetimeLocal(res.data.dataFim),
          });
          setLoading(false);
        },
        () => setLoading(false)
      );
    }
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...data,
        dataInicio: data.dataInicio ? new Date(data.dataInicio).toISOString() : '',
        dataFim: data.dataFim ? new Date(data.dataFim).toISOString() : '',
      };
      await httpClient.put(`/eventos/${id}`, payload);
      router.push(`/eventos/${id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erro ao salvar evento.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Editar evento
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
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField {...register('tipo')} select SelectProps={{ native: true }} label="Tipo" fullWidth>
                  <option value="Workshop">Workshop</option>
                  <option value="Mentoria">Mentoria</option>
                </TextField>
                <TextField {...register('formato')} select SelectProps={{ native: true }} label="Formato" fullWidth>
                  <option value="Presencial">Presencial</option>
                  <option value="Online">Online</option>
                  <option value="Híbrido">Híbrido</option>
                </TextField>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  {...register('dataInicio', { required: true })}
                  label="Data/hora início"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  {...register('dataFim', { required: true })}
                  label="Data/hora fim"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  {...register('vagasMaximas', { min: 1 })}
                  label="Vagas máximas"
                  type="number"
                  inputProps={{ min: 1 }}
                  fullWidth
                />
                <TextField {...register('status')} select SelectProps={{ native: true }} label="Status" fullWidth>
                  <option value="Rascunho">Rascunho</option>
                  <option value="Publicado">Publicado</option>
                  <option value="Arquivado">Arquivado</option>
                </TextField>
              </Box>
              <TextField {...register('descricao')} label="Descrição" multiline rows={4} fullWidth />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button component={Link} href={`/eventos/${id}`}>Cancelar</Button>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? <CircularProgress size={24} /> : 'Salvar'}
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
