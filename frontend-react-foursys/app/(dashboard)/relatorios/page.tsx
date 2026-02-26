'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { httpClient } from '@/data/http/httpClient';

interface AgendarForm {
  tipo: string;
  periodicidade: string;
  formato: string;
  destinatarios: string;
}

interface RelatorioAgendado {
  id: string;
  tipo: string;
  tipoLabel: string;
  periodicidade: string;
  periodicidadeLabel: string;
  formato: string;
  destinatarios: string[];
  proximoEnvio: string;
  ativo: boolean;
  criadoEm: string;
}

interface RelatorioHistorico {
  id: string;
  tipo: string;
  formato: string;
  enviadoEm: string;
  status: string;
  destinatarios: number;
}

interface RelatoriosData {
  agendados: RelatorioAgendado[];
  historico: RelatorioHistorico[];
}

export default function RelatoriosPage() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<RelatoriosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const { register, handleSubmit, reset } = useForm<AgendarForm>();

  const carregar = () => {
    httpClient.get<RelatoriosData>('/relatorios').then(
      (res) => { setData(res.data); setLoading(false); },
      () => setLoading(false)
    );
  };

  useEffect(() => {
    carregar();
  }, []);

  const onAgendar = async (formData: AgendarForm) => {
    await httpClient.post('/relatorios/agendar', {
      ...formData,
      destinatarios: formData.destinatarios.split(/[\s,;]+/).filter(Boolean),
    });
    setOpen(false);
    reset();
    carregar();
  };

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '-';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Relatórios</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Agendar relatório
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Relatórios e exportações. Liste de presença, inscritos, certificados e solicitações.
          </Typography>

          {loading || !data ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="Relatórios agendados" />
                <Tab label="Histórico de envios" />
              </Tabs>

              {tab === 0 && (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Periodicidade</TableCell>
                      <TableCell>Formato</TableCell>
                      <TableCell>Destinatários</TableCell>
                      <TableCell>Próximo envio</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.agendados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography color="text.secondary">Nenhum relatório agendado.</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.agendados.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>{r.tipoLabel}</TableCell>
                          <TableCell>{r.periodicidadeLabel}</TableCell>
                          <TableCell>{r.formato.toUpperCase()}</TableCell>
                          <TableCell>{r.destinatarios.join(', ')}</TableCell>
                          <TableCell>{formatDate(r.proximoEnvio)}</TableCell>
                          <TableCell>
                            <Chip label={r.ativo ? 'Ativo' : 'Inativo'} size="small" color={r.ativo ? 'success' : 'default'} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}

              {tab === 1 && (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Data</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Formato</TableCell>
                      <TableCell>Destinatários</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.historico.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell>{formatDate(h.enviadoEm)}</TableCell>
                        <TableCell>{h.tipo}</TableCell>
                        <TableCell>{h.formato.toUpperCase()}</TableCell>
                        <TableCell>{h.destinatarios}</TableCell>
                        <TableCell>
                          <Chip label={h.status} size="small" color={h.status === 'enviado' ? 'success' : 'error'} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agendar relatório</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onAgendar)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                {...register('tipo', { required: true })}
                select
                SelectProps={{ native: true }}
                label="Tipo"
                fullWidth
              >
                <option value="">Selecione</option>
                <option value="participantes">Participantes</option>
                <option value="certificados">Certificados</option>
                <option value="inscricoes">Inscrições</option>
              </TextField>
              <TextField
                {...register('periodicidade', { required: true })}
                select
                SelectProps={{ native: true }}
                label="Periodicidade"
                fullWidth
              >
                <option value="">Selecione</option>
                <option value="diario">Diário</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
              </TextField>
              <TextField
                {...register('formato', { required: true })}
                select
                SelectProps={{ native: true }}
                label="Formato"
                fullWidth
              >
                <option value="">Selecione</option>
                <option value="pdf">PDF</option>
                <option value="xlsx">Excel</option>
                <option value="csv">CSV</option>
              </TextField>
              <TextField
                {...register('destinatarios', { required: true })}
                label="Destinatários (e-mails separados por vírgula)"
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" variant="contained">Agendar</Button>
              </Box>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
