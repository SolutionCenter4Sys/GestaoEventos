'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import { httpClient } from '@/data/http/httpClient';

interface TemplateEmail {
  id?: string;
  nome: string;
  assunto: string;
  corpoHtml: string;
  gatilho: string;
  corPrimaria: string;
  ativo: boolean;
}

const GATILHOS = [
  { value: 'inscricao_confirmada', label: 'Inscrição Confirmada' },
  { value: 'inscricao_cancelada', label: 'Inscrição Cancelada' },
  { value: 'evento_proximo', label: 'Evento se Aproximando (48h antes)' },
  { value: 'certificado_disponivel', label: 'Certificado Disponível' },
  { value: 'lista_espera', label: 'Entrada na Lista de Espera' },
  { value: 'vaga_liberada', label: 'Vaga Liberada da Lista de Espera' },
  { value: 'solicitacao_aprovada', label: 'Solicitação Aprovada' },
  { value: 'solicitacao_reprovada', label: 'Solicitação Reprovada' },
];

export default function TemplatesEmailPage() {
  const [templates, setTemplates] = useState<TemplateEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TemplateEmail>({
    defaultValues: { gatilho: 'inscricao_confirmada', corPrimaria: '#1a237e', ativo: true },
  });

  useEffect(() => {
    httpClient.get<TemplateEmail[]>('/emails/templates').then(
      (res) => { setTemplates(res.data || []); setLoading(false); },
      () => setLoading(false)
    );
  }, []);

  const onSubmit = async (data: TemplateEmail) => {
    setSaving(true);
    try {
      if (editId) {
        await httpClient.put(`/emails/templates/${editId}`, data);
      } else {
        await httpClient.post('/emails/templates', data);
      }
      reset();
      setEditId(null);
      const res = await httpClient.get<TemplateEmail[]>('/emails/templates');
      setTemplates(res.data || []);
    } finally {
      setSaving(false);
    }
  };

  const editar = (t: TemplateEmail) => {
    reset(t);
    setEditId(t.id || null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Templates de E-mail
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardHeader title={editId ? 'Editar Template' : 'Novo Template'} />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                {...register('nome', { required: 'Nome obrigatório' })}
                label="Nome do Template"
                fullWidth
              />
              <TextField
                {...register('assunto', { required: 'Assunto obrigatório' })}
                label="Assunto do E-mail"
                fullWidth
              />
              <TextField
                {...register('gatilho', { required: true })}
                select
                SelectProps={{ native: true }}
                label="Gatilho"
                fullWidth
              >
                {GATILHOS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </TextField>
              <TextField
                {...register('corpoHtml', { required: 'Corpo obrigatório' })}
                label="Corpo HTML"
                multiline
                rows={6}
                fullWidth
              />
              <TextField {...register('corPrimaria', { required: true })} label="Cor Primária" type="color" fullWidth />
              <FormControlLabel control={<Switch {...register('ativo')} />} label="Template Ativo" />
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? <CircularProgress size={24} /> : 'Salvar'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Templates Cadastrados" />
        <CardContent>
          {loading ? (
            <CircularProgress />
          ) : templates.length === 0 ? (
            <Typography color="text.secondary">Nenhum template cadastrado.</Typography>
          ) : (
            <List>
              {templates.map((t) => (
                <ListItem key={t.id}>
                  <ListItemText primary={t.nome} secondary={t.assunto} />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => editar(t)}><EditIcon /></IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
