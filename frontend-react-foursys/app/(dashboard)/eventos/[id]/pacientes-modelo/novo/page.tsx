'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { validarCPF, mascaraCPF, mascaraTelefone, mascaraCEP, buscarEnderecoPorCEP } from '@/shared/utils/validators';
import { TermoLgpdScroll } from '@/presentation/components/TermoLgpdScroll';
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
  historicoSaude: string;
  restricoesAlergias: string;
  consentimento: boolean;
}

export default function CadastroPacienteModeloPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = useForm<FormData>();

  const validateCPF = (v: string) => {
    const nums = v.replace(/\D/g, '');
    if (nums.length < 11) return 'CPF deve ter 11 dígitos';
    return validarCPF(v) || 'CPF inválido';
  };

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
    setLoading(true);
    try {
      await httpClient.post(`/eventos/${id}/pacientes-modelo`, {
        ...data,
        cpf: data.cpf.replace(/\D/g, ''),
        telefone: data.telefone.replace(/\D/g, ''),
        cep: data.cep.replace(/\D/g, ''),
        endereco: `${data.rua}, ${data.numero}${data.complemento ? ` - ${data.complemento}` : ''}, ${data.bairro}, ${data.cidade}, CEP ${data.cep}`,
      });
      router.push(`/eventos/${id}/pacientes-modelo`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Novo paciente modelo
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
              <Controller
                name="cpf"
                control={control}
                rules={{ required: 'CPF obrigatório', validate: validateCPF }}
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
              <TextField
                {...register('dataNascimento', { required: 'Data obrigatória' })}
                label="Data de nascimento"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                {...register('email', {
                  required: 'E-mail obrigatório',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'E-mail inválido' },
                })}
                label="E-mail"
                type="email"
                fullWidth
              />
              <Controller
                name="cep"
                control={control}
                rules={{ required: 'CEP obrigatório' }}
                render={({ field }) => (
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
                    helperText={loadingCep ? 'Buscando endereço pelo CEP...' : errors.cep?.message}
                    error={!!errors.cep}
                    fullWidth
                  />
                )}
              />
              <TextField {...register('rua', { required: 'Rua obrigatória' })} label="Rua" fullWidth />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField {...register('numero', { required: 'Número obrigatório' })} label="Número" fullWidth />
                <TextField {...register('complemento')} label="Complemento" fullWidth />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField {...register('bairro', { required: 'Bairro obrigatório' })} label="Bairro" fullWidth />
                <TextField {...register('cidade', { required: 'Cidade obrigatória' })} label="Cidade" fullWidth />
              </Box>
              <Controller
                name="telefone"
                control={control}
                rules={{ required: 'Telefone obrigatório' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Telefone"
                    placeholder="(00) 00000-0000"
                    inputProps={{ maxLength: 15 }}
                    onChange={(e) => field.onChange(mascaraTelefone(e.target.value))}
                    fullWidth
                  />
                )}
              />
              <TextField {...register('historicoSaude')} label="Histórico de saúde" multiline fullWidth />
              <TextField {...register('restricoesAlergias')} label="Restrições/Alergias" multiline fullWidth />
              <Controller
                name="consentimento"
                control={control}
                rules={{ required: 'Aceite o termo LGPD' }}
                render={({ field }) => (
                  <TermoLgpdScroll
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.consentimento?.message}
                  />
                )}
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button component={Link} href={`/eventos/${id}/pacientes-modelo`}>Cancelar</Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  Salvar
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
