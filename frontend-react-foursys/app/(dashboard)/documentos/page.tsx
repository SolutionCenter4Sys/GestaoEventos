'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { httpClient } from '@/data/http/httpClient';

interface Documento {
  id: string;
  titulo: string;
  tipo: string;
  eventoId: string;
  eventoNome: string;
  status: string;
  solicitante: string;
  enviadoEm: string;
  revisadoEm?: string;
  revisadoPor?: string;
  observacao?: string;
}

const STATUS_LABELS: Record<string, string> = {
  aprovado: 'Aprovado',
  pendente_revisao: 'Pendente revisão',
  solicitar_alteracao: 'Solicitar alteração',
  reprovado: 'Reprovado',
};

const TIPO_LABELS: Record<string, string> = {
  termo_consentimento: 'Termo LGPD',
  anamnese: 'Anamnese',
  declaracao: 'Declaração',
  questionario: 'Questionário',
};

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    httpClient.get<Documento[]>('/documentos').then(
      (res) => { setDocumentos(res.data || []); setLoading(false); },
      () => setLoading(false)
    );
  }, []);

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '-';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'success';
      case 'pendente_revisao': return 'warning';
      case 'solicitar_alteracao': return 'info';
      case 'reprovado': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Documentos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Hub de documentos e anamneses. Revise e aprove documentos enviados por participantes.
      </Typography>
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : documentos.length === 0 ? (
            <Typography color="text.secondary">Nenhum documento cadastrado.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Evento</TableCell>
                  <TableCell>Solicitante</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Enviado em</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documentos.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.titulo}</TableCell>
                    <TableCell>{TIPO_LABELS[doc.tipo] || doc.tipo}</TableCell>
                    <TableCell>{doc.eventoNome}</TableCell>
                    <TableCell>{doc.solicitante}</TableCell>
                    <TableCell>
                      <Chip
                        label={STATUS_LABELS[doc.status] || doc.status}
                        size="small"
                        color={getStatusColor(doc.status) as never}
                      />
                    </TableCell>
                    <TableCell>{formatDate(doc.enviadoEm)}</TableCell>
                    <TableCell align="right">
                      {doc.status === 'pendente_revisao' && (
                        <Button
                          component={Link}
                          href={`/revisao-aprovacao-docs/${doc.id}`}
                          size="small"
                          startIcon={<VisibilityIcon />}
                        >
                          Revisar
                        </Button>
                      )}
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
