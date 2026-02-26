'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from '@mui/material';
import { httpClient } from '@/data/http/httpClient';

interface Solicitacao {
  id: string;
  status: string;
  solicitante?: { nome: string; email: string };
  evento?: { nome: string };
  createdAt?: string;
}

export default function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    httpClient.get<Solicitacao[]>('/solicitacoes').then(
      (res) => { setSolicitacoes(res.data || []); setLoading(false); },
      () => setLoading(false)
    );
  }, []);

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleString('pt-BR', { dateStyle: 'short' }) : '-';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Solicitações</Typography>
        <Button component={Link} href="/solicitar-evento" variant="contained" color="primary">
          Solicitar evento
        </Button>
      </Box>
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : solicitacoes.length === 0 ? (
            <Typography color="text.secondary">Nenhuma solicitação.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Evento</TableCell>
                  <TableCell>Solicitante</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {solicitacoes.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.evento?.nome || '-'}</TableCell>
                    <TableCell>{s.solicitante?.nome || s.solicitante?.email || '-'}</TableCell>
                    <TableCell><Chip label={s.status} size="small" /></TableCell>
                    <TableCell>{formatDate(s.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Button component={Link} href={`/solicitacoes/${s.id}`} size="small">
                        Ver
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
