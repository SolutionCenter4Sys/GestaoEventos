'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Box, Card, CardContent, Typography, Button, Chip } from '@mui/material';
import { httpClient } from '@/data/http/httpClient';

interface Evento {
  id: string;
  nome: string;
  tipo: string;
  formato: string;
  dataInicio: string;
  dataFim: string;
  vagasMaximas: number;
  status: string;
  descricao?: string;
}

export default function VisualizarEventoPage() {
  const params = useParams();
  const id = params.id as string;
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      httpClient.get<Evento>(`/eventos/${id}`).then(
        (res) => { setEvento(res.data); setLoading(false); },
        () => setLoading(false)
      );
    }
  }, [id]);

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }) : '-';

  if (loading || !evento) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{evento.nome}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={Link} href={`/eventos/${id}/editar`} variant="outlined">
            Editar
          </Button>
          <Button component={Link} href={`/eventos/${id}/participantes`}>
            Participantes
          </Button>
          <Button component={Link} href={`/eventos/${id}/certificados`}>
            Certificados
          </Button>
          <Button component={Link} href={`/eventos/${id}/lista-espera`}>
            Lista de espera
          </Button>
          <Button component={Link} href={`/eventos/${id}/pacientes-modelo`}>
            Paciente modelo
          </Button>
          <Button component={Link} href={`/eventos/${id}/financeiro`}>
            Financeiro
          </Button>
          <Button component={Link} href={`/eventos/${id}/checkin`}>
            Check-in
          </Button>
        </Box>
      </Box>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography><strong>Tipo:</strong> {evento.tipo}</Typography>
            <Typography><strong>Formato:</strong> {evento.formato}</Typography>
            <Typography><strong>Data início:</strong> {formatDate(evento.dataInicio)}</Typography>
            <Typography><strong>Data fim:</strong> {formatDate(evento.dataFim)}</Typography>
            <Typography><strong>Vagas:</strong> {evento.vagasMaximas}</Typography>
            <Typography><strong>Status:</strong> <Chip label={evento.status} size="small" /></Typography>
            {evento.descricao && (
              <Typography sx={{ mt: 2 }}><strong>Descrição:</strong><br />{evento.descricao}</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
