'use client';

import { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardHeader, Typography, Chip } from '@mui/material';
import Link from 'next/link';
import { httpClient } from '@/data/http/httpClient';

interface DashboardParticipante {
  proximosEventos: number;
  eventosRealizados: number;
  certificadosDisponiveis: number;
  inscricoesEmEspera: number;
}

interface EventoParticipante {
  id: string;
  nome: string;
  tipo: string;
  formato: string;
  dataInicio: string;
  status: string;
}

export default function MinhaAreaPage() {
  const [dashboard, setDashboard] = useState<DashboardParticipante | null>(null);
  const [proximosEventos, setProximosEventos] = useState<EventoParticipante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      httpClient.get<DashboardParticipante>('/participante/dashboard'),
      httpClient.get<EventoParticipante[]>('/participante/eventos'),
    ]).then(
      ([dashRes, evRes]) => {
        setDashboard(dashRes.data);
        setProximosEventos(evRes.data || []);
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }) : '-';

  if (loading) return <Typography>Carregando...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Minha área
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="primary">{dashboard?.proximosEventos ?? 0}</Typography>
            <Typography variant="body2" color="text.secondary">Próximos eventos</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h4" color="success.main">{dashboard?.eventosRealizados ?? 0}</Typography>
            <Typography variant="body2" color="text.secondary">Eventos realizados</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h4">{dashboard?.certificadosDisponiveis ?? 0}</Typography>
            <Typography variant="body2" color="text.secondary">Certificados</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h4">{dashboard?.inscricoesEmEspera ?? 0}</Typography>
            <Typography variant="body2" color="text.secondary">Lista de espera</Typography>
          </CardContent>
        </Card>
      </Box>
      <Card>
        <CardHeader title="Próximos eventos" />
        <CardContent>
          {proximosEventos.length === 0 ? (
            <Typography color="text.secondary">Você não está inscrito em nenhum evento futuro.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {proximosEventos.map((ev) => (
                <Box key={ev.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography>{ev.nome}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">{formatDate(ev.dataInicio)}</Typography>
                    <Chip label={ev.status === 'confirmado' ? 'Confirmado' : 'Em espera'} size="small" />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
