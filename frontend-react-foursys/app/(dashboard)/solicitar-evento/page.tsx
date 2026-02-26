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
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { mascaraTelefone, mascaraCEP, buscarEnderecoPorCEP } from '@/shared/utils/validators';
import { httpClient } from '@/data/http/httpClient';

const MAX_ANEXOS = 5;
const MAX_SIZE_MB = 10;

interface FormSolicitante {
  nome: string;
  email: string;
  telefone: string;
}

interface FormEvento {
  nome: string;
  tipo: string;
  formato: string;
  dataInicio: string;
  dataFim: string;
  descricao: string;
}

interface FormLogistica {
  vagasMaximas: number;
  local: string;
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  numero: string;
  complemento: string;
  endereco?: string;
  coffeBreak: boolean;
  certificado: boolean;
}

interface FormInfra {
  equipamentos: string;
  materiais: string;
  observacoes: string;
}

interface FormPaciente {
  requerPaciente: boolean;
  quantidadePacientes: number;
  perfilPaciente: string;
}

interface FormOrcamento {
  publicoAlvo: string;
  valorInvestimento: number;
  justificativa: string;
}

export default function SolicitarEventoPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [anexos, setAnexos] = useState<File[]>([]);
  const [loadingCepLogistica, setLoadingCepLogistica] = useState(false);

  const solicitante = useForm<FormSolicitante>({
    defaultValues: { nome: '', email: '', telefone: '' },
  });
  const evento = useForm<FormEvento>({
    defaultValues: {
      nome: '',
      tipo: 'Workshop',
      formato: 'Online',
      dataInicio: '',
      dataFim: '',
      descricao: '',
    },
  });
  const logistica = useForm<FormLogistica>({
    defaultValues: {
      vagasMaximas: 30,
      local: '',
      cep: '',
      rua: '',
      bairro: '',
      cidade: '',
      numero: '',
      complemento: '',
      coffeBreak: false,
      certificado: true,
    },
  });
  const infra = useForm<FormInfra>({ defaultValues: { equipamentos: '', materiais: '', observacoes: '' } });
  const paciente = useForm<FormPaciente>({
    defaultValues: { requerPaciente: false, quantidadePacientes: 1, perfilPaciente: '' },
  });
  const orcamento = useForm<FormOrcamento>({
    defaultValues: { publicoAlvo: '', valorInvestimento: 0, justificativa: '' },
  });

  const formato = evento.watch('formato');
  const requerPaciente = paciente.watch('requerPaciente');

  const preencherLogisticaPorCep = async (cep: string) => {
    const cepNumerico = cep.replace(/\D/g, '');
    if (cepNumerico.length !== 8) return;
    setLoadingCepLogistica(true);
    try {
      const endereco = await buscarEnderecoPorCEP(cepNumerico);
      if (!endereco) return;
      logistica.setValue('rua', endereco.rua);
      logistica.setValue('bairro', endereco.bairro);
      logistica.setValue('cidade', endereco.cidade);
      if (!logistica.getValues('complemento')) logistica.setValue('complemento', endereco.complemento);
    } finally {
      setLoadingCepLogistica(false);
    }
  };

  const onAnexosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid: File[] = [];
    for (const f of files) {
      if (valid.length >= MAX_ANEXOS) break;
      const ext = f.name.toLowerCase().split('.').pop();
      if (!['pdf', 'jpg', 'jpeg', 'png'].includes(ext || '')) continue;
      if (f.size > MAX_SIZE_MB * 1024 * 1024) continue;
      valid.push(f);
    }
    setAnexos((v) => [...v, ...valid].slice(0, MAX_ANEXOS));
    e.target.value = '';
  };

  const removerAnexo = (i: number) => {
    setAnexos((v) => v.filter((_, idx) => idx !== i));
  };

  const formatFileSize = (bytes: number) =>
    bytes < 1024 ? bytes + ' B' : (bytes / 1024).toFixed(1) + ' KB';

  const steps = [
    'Dados do solicitante',
    'Informações do evento',
    'Logística',
    'Infraestrutura',
    'Paciente modelo',
    'Orçamento',
  ];

  const enviar = async () => {
    setSaving(true);
    setError(null);
    try {
      const sol = solicitante.getValues();
      const logisticaValues = logistica.getValues();
      const payload = {
        status: 'Enviado',
        solicitante: { ...sol, telefone: sol.telefone?.replace(/\D/g, '') || sol.telefone },
        evento: evento.getValues(),
        logistica: {
          ...logisticaValues,
          cep: logisticaValues.cep?.replace(/\D/g, '') || '',
          endereco: `${logisticaValues.rua}, ${logisticaValues.numero}${logisticaValues.complemento ? ` - ${logisticaValues.complemento}` : ''}, ${logisticaValues.bairro}, ${logisticaValues.cidade}, CEP ${logisticaValues.cep}`,
        },
        infraestrutura: infra.getValues(),
        pacienteModelo: paciente.getValues(),
        orcamento: orcamento.getValues(),
        anexos: anexos.map((f) => ({ nome: f.name, size: f.size })),
      };
      await httpClient.post('/solicitacoes', payload);
      router.push('/solicitacoes');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erro ao enviar solicitação.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Solicitação de evento</Typography>
        <Button component={Link} href="/solicitacoes" startIcon={<span>←</span>}>
          Voltar
        </Button>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          {activeStep === 0 && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                {...solicitante.register('nome', { required: 'Nome obrigatório' })}
                label="Nome completo"
                error={!!solicitante.formState.errors.nome}
                helperText={solicitante.formState.errors.nome?.message}
                fullWidth
              />
              <TextField
                {...solicitante.register('email', {
                  required: 'E-mail obrigatório',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'E-mail inválido' },
                })}
                label="E-mail"
                type="email"
                error={!!solicitante.formState.errors.email}
                helperText={solicitante.formState.errors.email?.message}
                fullWidth
              />
              <Controller
                name="telefone"
                control={solicitante.control}
                rules={{ required: 'Telefone obrigatório', minLength: { value: 10, message: 'Telefone inválido' } }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Telefone"
                    placeholder="(XX) XXXXX-XXXX"
                    inputProps={{ maxLength: 15 }}
                    onChange={(e) => field.onChange(mascaraTelefone(e.target.value))}
                    error={!!solicitante.formState.errors.telefone}
                    helperText={solicitante.formState.errors.telefone?.message}
                    fullWidth
                  />
                )}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setActiveStep(1)} variant="contained">
                  Próximo
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                {...evento.register('nome', { required: 'Nome obrigatório' })}
                label="Nome do evento"
                fullWidth
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  {...evento.register('tipo', { required: true })}
                  select
                  SelectProps={{ native: true }}
                  label="Tipo"
                  fullWidth
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Mentoria">Mentoria</option>
                </TextField>
                <TextField
                  {...evento.register('formato', { required: true })}
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
                  {...evento.register('dataInicio', { required: 'Data obrigatória' })}
                  label="Data/hora início"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  {...evento.register('dataFim', { required: 'Data obrigatória' })}
                  label="Data/hora fim"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
              <TextField
                {...evento.register('descricao')}
                label="Descrição"
                multiline
                rows={3}
                fullWidth
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => setActiveStep(0)}>Voltar</Button>
                <Button onClick={() => setActiveStep(2)} variant="contained">
                  Próximo
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                {...logistica.register('vagasMaximas', {
                  required: true,
                  min: { value: 1, message: 'Mínimo 1' },
                })}
                label="Vagas máximas"
                type="number"
                inputProps={{ min: 1 }}
                fullWidth
              />
              {formato !== 'Online' && (
                <>
                  <TextField
                    {...logistica.register('local', { required: formato !== 'Online' })}
                    label="Local"
                    fullWidth
                  />
                  <Controller
                    name="cep"
                    control={logistica.control}
                    rules={{ required: formato !== 'Online' ? 'CEP obrigatório' : false }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="CEP"
                        placeholder="00000-000"
                        inputProps={{ maxLength: 9 }}
                        onChange={(e) => field.onChange(mascaraCEP(e.target.value))}
                        onBlur={(e) => {
                          field.onBlur();
                          void preencherLogisticaPorCep(e.target.value);
                        }}
                        helperText={loadingCepLogistica ? 'Buscando endereço pelo CEP...' : logistica.formState.errors.cep?.message}
                        error={!!logistica.formState.errors.cep}
                        fullWidth
                      />
                    )}
                  />
                  <TextField {...logistica.register('rua', { required: formato !== 'Online' })} label="Rua" fullWidth />
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <TextField {...logistica.register('numero', { required: formato !== 'Online' })} label="Número" fullWidth />
                    <TextField {...logistica.register('complemento')} label="Complemento" fullWidth />
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <TextField {...logistica.register('bairro', { required: formato !== 'Online' })} label="Bairro" fullWidth />
                    <TextField {...logistica.register('cidade', { required: formato !== 'Online' })} label="Cidade" fullWidth />
                  </Box>
                </>
              )}
              <FormControlLabel
                control={<Checkbox {...logistica.register('coffeBreak')} />}
                label="Coffee break necessário"
              />
              <FormControlLabel
                control={<Checkbox {...logistica.register('certificado')} />}
                label="Emitir certificado de participação"
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => setActiveStep(1)}>Voltar</Button>
                <Button onClick={() => setActiveStep(3)} variant="contained">
                  Próximo
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 3 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                {...infra.register('equipamentos')}
                label="Equipamentos necessários"
                placeholder="Ex: Projetor, microfone, flipchart"
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                {...infra.register('materiais')}
                label="Materiais de consumo"
                placeholder="Ex: Apostilas, canetas"
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                {...infra.register('observacoes')}
                label="Observações adicionais"
                multiline
                rows={2}
                fullWidth
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => setActiveStep(2)}>Voltar</Button>
                <Button onClick={() => setActiveStep(4)} variant="contained">
                  Próximo
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 4 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={<Checkbox {...paciente.register('requerPaciente')} />}
                label="Este evento requer paciente modelo"
              />
              {requerPaciente && (
                <>
                  <TextField
                    {...paciente.register('quantidadePacientes', {
                      required: requerPaciente,
                      min: { value: 1, message: 'Mínimo 1' },
                    })}
                    label="Quantidade de pacientes"
                    type="number"
                    inputProps={{ min: 1 }}
                    fullWidth
                  />
                  <TextField
                    {...paciente.register('perfilPaciente')}
                    label="Perfil/requisitos do paciente"
                    placeholder="Ex: Idade, tipo de pele"
                    multiline
                    rows={3}
                    fullWidth
                  />
                </>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => setActiveStep(3)}>Voltar</Button>
                <Button onClick={() => setActiveStep(5)} variant="contained">
                  Próximo
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 5 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                {...orcamento.register('publicoAlvo', { required: 'Público obrigatório' })}
                label="Público-alvo"
                placeholder="Ex: Profissionais de estética"
                fullWidth
              />
              <TextField
                {...orcamento.register('valorInvestimento', { min: 0 })}
                label="Valor de investimento estimado (R$)"
                type="number"
                inputProps={{ min: 0 }}
                fullWidth
              />
              <TextField
                {...orcamento.register('justificativa')}
                label="Justificativa comercial"
                multiline
                rows={4}
                fullWidth
              />
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2">Anexos (até 5 arquivos PDF/JPG/PNG, máx 10MB cada)</Typography>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={onAnexosChange}
                  style={{ display: 'none' }}
                  id="anexos-input"
                />
                <label htmlFor="anexos-input">
                  <Button component="span" variant="outlined" disabled={anexos.length >= 5}>
                    Selecionar arquivos ({anexos.length}/5)
                  </Button>
                </label>
                {anexos.length > 0 && (
                  <ul style={{ margin: '8px 0 0', paddingLeft: 24 }}>
                    {anexos.map((a, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {a.name} ({formatFileSize(a.size)})
                        <Button size="small" onClick={() => removerAnexo(i)}>
                          Remover
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button onClick={() => setActiveStep(4)}>Voltar</Button>
                <Button onClick={enviar} variant="contained" disabled={saving}>
                  {saving ? <CircularProgress size={24} /> : 'Enviar solicitação'}
                </Button>
              </Box>
              {error && <Typography color="error">{error}</Typography>}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
