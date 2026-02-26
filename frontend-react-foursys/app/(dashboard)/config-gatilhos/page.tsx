'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { httpClient } from '@/data/http/httpClient';

interface Gatilho {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  templateEmailId: string;
  templateEmailNome: string;
  ativo: boolean;
  ultimaExecucao: string | null;
  execucoesHoje: number;
}

interface GatilhoHistorico {
  id: string;
  gatilho: string;
  destinatario: string;
  evento: string;
  status: string;
  dataHora: string;
}

export default function ConfigGatilhosPage() {
  const [gatilhos, setGatilhos] = useState<Gatilho[]>([]);
  const [historico, setHistorico] = useState<GatilhoHistorico[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const carregar = () => {
      httpClient.get<Gatilho[]>('/gatilhos').then(
        (res) => { setGatilhos(res.data || []); setLoading(false); },
        () => setLoading(false)
      );
    };
    carregar();
  }, []);

  useEffect(() => {
    if (tab === 1) {
      httpClient.get<GatilhoHistorico[]>('/gatilhos?historico=1').then(
        (res) => setHistorico(res.data || []),
        () => {}
      );
    }
  }, [tab]);

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '-';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gatilhos</Typography>
        <Button component={Link} href="/templates-email" variant="outlined">
          Configurar templates
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Configuração de gatilhos automatizados. E-mails disparados em eventos do sistema (inscrição, aprovação, lembrete, certificado).
      </Typography>

      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, pt: 1 }}>
          <Tab label="Gatilhos" />
          <Tab label="Histórico de execuções" />
        </Tabs>
        <CardContent>
          {loading && tab === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : tab === 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Gatilho</TableCell>
                  <TableCell>Template</TableCell>
                  <TableCell>Última execução</TableCell>
                  <TableCell align="right">Hoje</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gatilhos.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>
                      <Box>
                        <Typography fontWeight={600}>{g.nome}</Typography>
                        <Typography variant="caption" color="text.secondary">{g.descricao}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {g.templateEmailNome ? (
                        <Button component={Link} href="/templates-email" size="small" sx={{ textTransform: 'none' }}>
                          {g.templateEmailNome}
                        </Button>
                      ) : (
                        <Typography variant="body2" color="text.secondary">(não configurado)</Typography>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(g.ultimaExecucao)}</TableCell>
                    <TableCell align="right">{g.execucoesHoje}</TableCell>
                    <TableCell>
                      <Chip
                        icon={g.ativo ? <NotificationsActiveIcon /> : undefined}
                        label={g.ativo ? 'Ativo' : 'Inativo'}
                        size="small"
                        color={g.ativo ? 'success' : 'default'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Data/hora</TableCell>
                  <TableCell>Gatilho</TableCell>
                  <TableCell>Destinatário</TableCell>
                  <TableCell>Evento</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historico.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="text.secondary">Nenhuma execução registrada.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  historico.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>{formatDate(h.dataHora)}</TableCell>
                      <TableCell>{h.gatilho}</TableCell>
                      <TableCell>{h.destinatario}</TableCell>
                      <TableCell>{h.evento}</TableCell>
                      <TableCell>
                        <Chip
                          label={h.status}
                          size="small"
                          color={h.status === 'enviado' ? 'success' : 'error'}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
