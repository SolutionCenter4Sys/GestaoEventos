'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { httpClient } from '@/data/http/httpClient';

interface SyncStatus {
  status: string;
  ultimaSincronizacao: string;
  contaConectada: string;
  eventosSincronizados: number;
  eventosPendentes: number;
  historico: Array<{
    id: string;
    dataHora: string;
    status: string;
    eventosProcessados?: number;
    eventosCriados?: number;
    eventosAtualizados?: number;
    mensagem?: string;
    duracaoMs: number;
  }>;
  eventosPendentesLista: Array<{ id: string; nome: string; motivo: string }>;
}

export default function PainelSincronizacaoPage() {
  const [data, setData] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    httpClient.get<SyncStatus>('/outlook/sync').then(
      (res) => { setData(res.data); setLoading(false); },
      () => setLoading(false)
    );
  }, []);

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }) : '-';

  const formatMs = (ms: number) => ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;

  if (loading || !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Integração Outlook
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Sincronização com calendário Outlook. Eventos publicados na plataforma são automaticamente criados no Outlook.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {data.status === 'conectado' ? (
                <CheckCircleIcon color="success" />
              ) : (
                <ErrorIcon color="error" />
              )}
              <Chip
                label={data.status === 'conectado' ? 'Conectado' : data.status}
                color={data.status === 'conectado' ? 'success' : 'error'}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">Status</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h5">{data.contaConectada}</Typography>
            <Typography variant="body2" color="text.secondary">Conta conectada</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h5">{data.eventosSincronizados}</Typography>
            <Typography variant="body2" color="text.secondary">Eventos sincronizados</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h5">{data.eventosPendentes}</Typography>
            <Typography variant="body2" color="text.secondary">Pendentes</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="body1" fontWeight={600}>{formatDate(data.ultimaSincronizacao)}</Typography>
            <Typography variant="body2" color="text.secondary">Última sincronização</Typography>
          </CardContent>
        </Card>
      </Box>

      {data.eventosPendentesLista.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Eventos pendentes de sincronização" />
          <CardContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Evento</TableCell>
                  <TableCell>Motivo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.eventosPendentesLista.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.nome}</TableCell>
                    <TableCell>{e.motivo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader title="Histórico de sincronização" avatar={<SyncIcon />} />
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Processados</TableCell>
                <TableCell align="right">Criados</TableCell>
                <TableCell align="right">Atualizados</TableCell>
                <TableCell align="right">Duração</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.historico.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>{formatDate(h.dataHora)}</TableCell>
                  <TableCell>
                    {h.status === 'sucesso' ? (
                      <Chip icon={<CheckCircleIcon />} label="Sucesso" color="success" size="small" />
                    ) : (
                      <Chip icon={<ErrorIcon />} label="Erro" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell align="right">{h.eventosProcessados ?? '-'}</TableCell>
                  <TableCell align="right">{h.eventosCriados ?? '-'}</TableCell>
                  <TableCell align="right">{h.eventosAtualizados ?? '-'}</TableCell>
                  <TableCell align="right">{formatMs(h.duracaoMs)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data.historico.some((h) => h.status === 'erro' && h.mensagem) && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {data.historico.find((h) => h.status === 'erro')?.mensagem}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
