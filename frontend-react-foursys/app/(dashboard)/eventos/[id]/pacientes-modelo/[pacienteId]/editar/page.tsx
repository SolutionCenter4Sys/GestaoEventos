'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { mascaraCPF, mascaraTelefone, mascaraCEP, buscarEnderecoPorCEP } from '@/shared/utils/validators';
import { httpClient } from '@/data/http/httpClient';

interface FormData {
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  numero: string;
  complemento: string;
  endereco?: string;
}

export default function EditarPacienteModeloPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const pacienteId = params.pacienteId as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  const { register, handleSubmit, reset, control, setValue, getValues } = useForm<FormData>();

  useEffect(() => {
    if (id && pacienteId) {
      httpClient.get<FormData>(`/eventos/${id}/pacientes-modelo/${pacienteId}`).then(
        (res) => {
          reset({
            ...res.data,
            cpf: res.data.cpf ? mascaraCPF(res.data.cpf.replace(/\D/g, '')) : '',
            telefone: res.data.telefone ? mascaraTelefone(res.data.telefone.replace(/\D/g, '')) : '',
            cep: res.data.cep ? mascaraCEP(res.data.cep.replace(/\D/g, '')) : '',
            rua: res.data.rua || res.data.endereco || '',
            bairro: res.data.bairro || '',
            cidade: res.data.cidade || '',
            numero: res.data.numero || '',
            complemento: res.data.complemento || '',
          });
          setLoading(false);
        },
        () => setLoading(false)
      );
    }
  }, [id, pacienteId, reset]);

  const preencherEnderecoPorCep = async (cep: string) => {
    const cepNumerico = cep.replace(/\D/g, '');
    if (cepNumerico.length !== 8) return;
    setLoadingCep(true);
    try {
      const endereco = await buscarEnderecoPorCEP(cepNumerico);
      if (!endereco) return;
      setValue('rua', endereco.rua);
      setValue('bairro', endereco.bairro);
      setValue('cidade', endereco.cidade);
      if (!getValues('complemento')) setValue('complemento', endereco.complemento);
    } finally {
      setLoadingCep(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      await httpClient.put(`/eventos/${id}/pacientes-modelo/${pacienteId}`, {
        ...data,
        cpf: data.cpf.replace(/\D/g, ''),
        telefone: data.telefone.replace(/\D/g, ''),
        cep: data.cep.replace(/\D/g, ''),
        endereco: `${data.rua}, ${data.numero}${data.complemento ? ` - ${data.complemento}` : ''}, ${data.bairro}, ${data.cidade}, CEP ${data.cep}`,
      });
      router.push(`/eventos/${id}/pacientes-modelo`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Typography>Carregando...</Typography>;

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Editar paciente modelo
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField {...register('nome', { required: true })} label="Nome" fullWidth />
              <TextField {...register('cpf')} label="CPF" fullWidth />
              <TextField {...register('dataNascimento')} label="Data nascimento" type="date" InputLabelProps={{ shrink: true }} fullWidth />
              <TextField {...register('email', { required: true })} label="E-mail" type="email" fullWidth />
              <TextField {...register('telefone')} label="Telefone" fullWidth />
              <Controller
                name="cep"
                control={control}
                rules={{ required: 'CEP obrigatório' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="CEP"
                    placeholder="00000-000"
                    inputProps={{ maxLength: 9 }}
                    onChange={(e) => field.onChange(mascaraCEP(e.target.value))}
                    onBlur={(e) => {
                      field.onBlur();
                      void preencherEnderecoPorCep(e.target.value);
                    }}
                    helperText={loadingCep ? 'Buscando endereço pelo CEP...' : fieldState.error?.message}
                    error={!!fieldState.error}
                    fullWidth
                  />
                )}
              />
              <TextField {...register('rua', { required: true })} label="Rua" fullWidth />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField {...register('numero', { required: true })} label="Número" fullWidth />
                <TextField {...register('complemento')} label="Complemento" fullWidth />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField {...register('bairro', { required: true })} label="Bairro" fullWidth />
                <TextField {...register('cidade', { required: true })} label="Cidade" fullWidth />
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button component={Link} href={`/eventos/${id}/pacientes-modelo`}>Cancelar</Button>
                <Button type="submit" variant="contained" disabled={saving}>Salvar</Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
