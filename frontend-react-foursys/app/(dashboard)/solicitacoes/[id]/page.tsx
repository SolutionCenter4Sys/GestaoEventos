'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Box, Card, CardContent, Typography, Button, Chip } from '@mui/material';
import { httpClient } from '@/data/http/httpClient';

interface Solicitacao {
  id: string;
  status: string;
  solicitante?: { nome: string; email: string; telefone: string };
  evento?: { nome: string; tipo: string; formato: string };
  logistica?: { vagasMaximas: number };
  orcamento?: { publicoAlvo: string };
}

export default function DetalheSolicitacaoPage() {
  const params = useParams();
  const id = params.id as string;
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      httpClient.get<Solicitacao>(`/solicitacoes/${id}`).then(
        (res) => { setSolicitacao(res.data); setLoading(false); },
        () => setLoading(false)
      );
    }
  }, [id]);

  if (loading || !solicitacao) return <Typography>Carregando...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Solicitação</Typography>
        <Button component={Link} href="/solicitacoes">Voltar</Button>
      </Box>
      <Card>
        <CardContent>
          <Typography><strong>Status:</strong> <Chip label={solicitacao.status} size="small" /></Typography>
          <Typography sx={{ mt: 1 }}><strong>Evento:</strong> {solicitacao.evento?.nome || '-'}</Typography>
          <Typography><strong>Solicitante:</strong> {solicitacao.solicitante?.nome || '-'}</Typography>
          <Typography><strong>E-mail:</strong> {solicitacao.solicitante?.email || '-'}</Typography>
          <Typography><strong>Público-alvo:</strong> {solicitacao.orcamento?.publicoAlvo || '-'}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
