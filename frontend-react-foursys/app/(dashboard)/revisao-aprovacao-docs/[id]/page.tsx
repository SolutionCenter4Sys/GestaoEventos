'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Box, Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { httpClient } from '@/data/http/httpClient';

interface FormData {
  decisao: string;
}

export default function RevisaoAprovacaoDocsPage() {
  const params = useParams();
  const id = params.id as string;
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await httpClient.post(`/documentos/${id}/revisao`, { decisao: data.decisao });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Revisão e aprovação de documentos
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('decisao', { required: true })}
              select
              SelectProps={{ native: true }}
              label="Decisão"
              fullWidth
              sx={{ mb: 2 }}
            >
              <option value="">Selecione</option>
              <option value="aprovado">Aprovado</option>
              <option value="reprovado">Reprovado</option>
              <option value="solicitar_alteracao">Solicitar alteração</option>
            </TextField>
            <Button type="submit" variant="contained">
              Enviar decisão
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
