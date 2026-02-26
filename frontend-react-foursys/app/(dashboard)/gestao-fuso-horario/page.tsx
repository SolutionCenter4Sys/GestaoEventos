'use client';

import { Box, Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { httpClient } from '@/data/http/httpClient';

interface FormData {
  fusoHorarioPadrao: string;
  fusoOrigem: string;
  dataHoraOrigem: string;
  fusoDestino: string;
}

export default function GestaoFusoHorarioPage() {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await httpClient.post('/fuso-horario', data);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestão de Fuso Horário
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                {...register('fusoHorarioPadrao', { required: true })}
                label="Fuso horário padrão"
                fullWidth
              />
              <TextField
                {...register('fusoOrigem', { required: true })}
                label="Fuso origem"
                fullWidth
              />
              <TextField
                {...register('dataHoraOrigem', { required: true })}
                label="Data/hora origem"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                {...register('fusoDestino', { required: true })}
                label="Fuso destino"
                fullWidth
              />
              <Button type="submit" variant="contained">
                Salvar
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
