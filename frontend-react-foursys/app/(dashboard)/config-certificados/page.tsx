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

interface TemplateCertificado {
  id?: string;
  nome: string;
  titulo: string;
  textoBase: string;
  assinatura1Nome: string;
  assinatura1Cargo: string;
  assinatura2Nome?: string;
  assinatura2Cargo?: string;
  logoUrl?: string;
  corPrimaria: string;
  corSecundaria: string;
  fonteTitulo: string;
  fonteTexto: string;
  ativo: boolean;
}

export default function ConfigCertificadosPage() {
  const [templates, setTemplates] = useState<TemplateCertificado[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TemplateCertificado>({
    defaultValues: {
      titulo: 'CERTIFICADO DE PARTICIPAÇÃO',
      textoBase: 'Certificamos que {{nome_participante}} participou do evento {{nome_evento}}, realizado em {{data_evento}}, com carga horária de {{carga_horaria}} horas.',
      corPrimaria: '#1a237e',
      corSecundaria: '#5c6bc0',
      fonteTitulo: 'Playfair Display',
      fonteTexto: 'Georgia',
      ativo: true,
    },
  });

  useEffect(() => {
    httpClient.get<TemplateCertificado[]>('/certificados/templates').then(
      (res) => { setTemplates(res.data || []); setLoading(false); },
      () => setLoading(false)
    );
  }, []);

  const onSubmit = async (data: TemplateCertificado) => {
    setSaving(true);
    try {
      if (editId) {
        await httpClient.put(`/certificados/templates/${editId}`, data);
      } else {
        await httpClient.post('/certificados/templates', data);
      }
      reset();
      setEditId(null);
      const res = await httpClient.get<TemplateCertificado[]>('/certificados/templates');
      setTemplates(res.data || []);
    } finally {
      setSaving(false);
    }
  };

  const editar = (t: TemplateCertificado) => {
    reset(t);
    setEditId(t.id || null);
  };

  const excluir = async (id: string) => {
    if (!confirm('Excluir este template?')) return;
    await httpClient.delete(`/certificados/templates/${id}`);
    setTemplates((v) => v.filter((t) => t.id !== id));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configuração de Templates de Certificados
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
                {...register('titulo', { required: 'Título obrigatório' })}
                label="Título do Certificado"
                fullWidth
              />
              <TextField
                {...register('textoBase', { required: 'Texto base obrigatório' })}
                label="Texto Base"
                multiline
                rows={4}
                fullWidth
                helperText="Variáveis: {{nome_participante}}, {{nome_evento}}, {{data_evento}}, {{carga_horaria}}"
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  {...register('assinatura1Nome', { required: 'Obrigatório' })}
                  label="Nome 1ª Assinatura"
                  fullWidth
                />
                <TextField
                  {...register('assinatura1Cargo', { required: 'Obrigatório' })}
                  label="Cargo 1ª Assinatura"
                  fullWidth
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField {...register('assinatura2Nome')} label="Nome 2ª Assinatura (opcional)" fullWidth />
                <TextField {...register('assinatura2Cargo')} label="Cargo 2ª Assinatura (opcional)" fullWidth />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField {...register('corPrimaria', { required: true })} label="Cor Primária" type="color" fullWidth />
                <TextField {...register('corSecundaria', { required: true })} label="Cor Secundária" type="color" fullWidth />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField {...register('fonteTitulo', { required: true })} select SelectProps={{ native: true }} label="Fonte Título" fullWidth>
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Playfair Display">Playfair Display</option>
                </TextField>
                <TextField {...register('fonteTexto', { required: true })} select SelectProps={{ native: true }} label="Fonte Texto" fullWidth>
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Roboto">Roboto</option>
                </TextField>
              </Box>
              <TextField {...register('logoUrl')} label="URL do Logo (opcional)" fullWidth />
              <FormControlLabel control={<Switch {...register('ativo')} />} label="Template Ativo" />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? <CircularProgress size={24} /> : 'Salvar'}
                </Button>
                {editId && (
                  <Button onClick={() => { reset(); setEditId(null); }}>
                    Cancelar
                  </Button>
                )}
              </Box>
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
                  <ListItemText primary={t.nome} secondary={t.titulo} />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => editar(t)}><EditIcon /></IconButton>
                    {t.id && <IconButton onClick={() => excluir(t.id!)}><DeleteIcon /></IconButton>}
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
