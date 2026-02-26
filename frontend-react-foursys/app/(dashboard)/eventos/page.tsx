'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Box, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@mui/material';
import { httpClient } from '@/data/http/httpClient';

interface Evento {
  id: string;
  nome: string;
  tipo: string;
  formato: string;
  dataInicio: string;
  dataFim: string;
  status: string;
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    httpClient.get<Evento[]>('/eventos').then(
      (res) => { setEventos(res.data || []); setLoading(false); },
      () => setLoading(false)
    );
  }, []);

  const formatDate = (d: string) => {
    if (!d) return '-';
    return new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Eventos</Typography>
        <Button component={Link} href="/eventos/novo" variant="contained" color="primary">
          Novo evento
        </Button>
      </Box>
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : eventos.length === 0 ? (
            <Typography color="text.secondary">Nenhum evento cadastrado.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Formato</TableCell>
                  <TableCell>Início</TableCell>
                  <TableCell>Fim</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eventos.map((ev) => (
                  <TableRow key={ev.id}>
                    <TableCell>{ev.nome}</TableCell>
                    <TableCell>{ev.tipo}</TableCell>
                    <TableCell>{ev.formato}</TableCell>
                    <TableCell>{formatDate(ev.dataInicio)}</TableCell>
                    <TableCell>{formatDate(ev.dataFim)}</TableCell>
                    <TableCell>{ev.status}</TableCell>
                    <TableCell align="right">
                      <Button component={Link} href={`/eventos/${ev.id}`} size="small">
                        Ver
                      </Button>
                      <Button component={Link} href={`/eventos/${ev.id}/editar`} size="small">
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
