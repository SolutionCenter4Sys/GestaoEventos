'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { httpClient } from '@/data/http/httpClient';

interface DashboardGerencial {
  resumo: {
    totalEventos: number;
    eventosPublicados: number;
    eventosRealizados: number;
    taxaOcupacaoMedia: number;
    taxaPresencaMedia: number;
    conversaoInscricoes: number;
    solicitacoesPendentes: number;
  };
  ocupacaoPorTipo: Array<{ tipo: string; total: number; ocupacaoMedia: number; eventos: number }>;
  eventosPorStatus: Array<{ status: string; quantidade: number }>;
  demandaPorMes: Array<{ mes: string; inscricoes: number; certificados: number }>;
  topEventosOcupacao: Array<{ id: string; nome: string; ocupacao: number; vagas: number; preenchidas: number }>;
}

export default function DashboardGerencialPage() {
  const [data, setData] = useState<DashboardGerencial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    httpClient.get<DashboardGerencial>('/dashboard-gerencial').then(
      (res) => { setData(res.data); setLoading(false); },
      () => setLoading(false)
    );
  }, []);

  const formatMes = (mes: string) => {
    const [ano, num] = mes.split('-');
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${meses[parseInt(num, 10) - 1]}/${ano}`;
  };

  if (loading || !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const { resumo, ocupacaoPorTipo, eventosPorStatus, demandaPorMes, topEventosOcupacao } = data;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard Gerencial
        </Typography>
        <Button component={Link} href="/relatorios" variant="outlined">
          Relatórios
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <EventIcon color="primary" />
                <Typography variant="h4">{resumo.totalEventos}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">Total de eventos</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUpIcon color="success" />
                <Typography variant="h4">{resumo.taxaOcupacaoMedia}%</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">Taxa ocupação média</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PeopleIcon color="info" />
                <Typography variant="h4">{resumo.taxaPresencaMedia}%</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">Taxa presença média</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircleIcon color="action" />
                <Typography variant="h4">{resumo.conversaoInscricoes}%</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">Conversão inscrições</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Eventos por status" />
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Quantidade</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventosPorStatus.map((e) => (
                    <TableRow key={e.status}>
                      <TableCell><Chip label={e.status} size="small" /></TableCell>
                      <TableCell align="right">{e.quantidade}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Ocupação por tipo de evento" />
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="right">Eventos</TableCell>
                    <TableCell align="right">Ocupação média</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ocupacaoPorTipo.map((o) => (
                    <TableRow key={o.tipo}>
                      <TableCell>{o.tipo}</TableCell>
                      <TableCell align="right">{o.eventos}</TableCell>
                      <TableCell align="right">{o.ocupacaoMedia}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Demanda por mês" />
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Mês</TableCell>
                    <TableCell align="right">Inscrições</TableCell>
                    <TableCell align="right">Certificados</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {demandaPorMes.map((d) => (
                    <TableRow key={d.mes}>
                      <TableCell>{formatMes(d.mes)}</TableCell>
                      <TableCell align="right">{d.inscricoes}</TableCell>
                      <TableCell align="right">{d.certificados}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Top eventos por ocupação" />
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Evento</TableCell>
                    <TableCell align="right">Ocupação</TableCell>
                    <TableCell align="right">Vagas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topEventosOcupacao.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>
                        <Button component={Link} href={`/eventos/${e.id}`} size="small" sx={{ textTransform: 'none', fontWeight: 500 }}>
                          {e.nome}
                        </Button>
                      </TableCell>
                      <TableCell align="right">{e.ocupacao}%</TableCell>
                      <TableCell align="right">{e.preenchidas}/{e.vagas}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
