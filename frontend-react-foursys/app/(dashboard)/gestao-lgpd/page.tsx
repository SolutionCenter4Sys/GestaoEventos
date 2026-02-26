'use client';

import { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
} from '@mui/material';
import { httpClient } from '@/data/http/httpClient';

interface LgpdData {
  resumo: {
    consentimentosRegistrados: number;
    solicitacoesExclusao: number;
    solicitacoesPortabilidade: number;
    solicitacoesPendentes: number;
  };
  consentimentos: Array<{
    id: string;
    tipo: string;
    evento: string;
    participante: string;
    dataConsentimento: string;
    versao: string;
  }>;
  solicitacoes: Array<{
    id: string;
    tipo: string;
    solicitante: string;
    status: string;
    dataSolicitacao: string;
    prazoResposta?: string;
    dataConclusao?: string;
  }>;
  baseLegal: Array<{
    id: string;
    finalidade: string;
    baseLegal: string;
    categoria: string;
    retencao: string;
  }>;
}

const TIPO_CONSENTIMENTO: Record<string, string> = {
  termo_consentimento: 'Termo LGPD',
  autorizacao_imagem: 'Autorização Imagem',
  politica_privacidade: 'Política Privacidade',
};

export default function GestaoLgpdPage() {
  const [data, setData] = useState<LgpdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    httpClient.get<LgpdData>('/lgpd').then(
      (res) => { setData(res.data); setLoading(false); },
      () => setLoading(false)
    );
  }, []);

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '-';

  if (loading || !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const { resumo, consentimentos, solicitacoes, baseLegal } = data;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestão LGPD
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Gestão de consentimentos, dados pessoais e direitos do titular (exclusão, portabilidade).
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4">{resumo.consentimentosRegistrados}</Typography>
              <Typography variant="body2" color="text.secondary">Consentimentos</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">{resumo.solicitacoesPendentes}</Typography>
              <Typography variant="body2" color="text.secondary">Solicitações pendentes</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4">{resumo.solicitacoesExclusao}</Typography>
              <Typography variant="body2" color="text.secondary">Exclusões (total)</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4">{resumo.solicitacoesPortabilidade}</Typography>
              <Typography variant="body2" color="text.secondary">Portabilidade (total)</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, pt: 1 }}>
          <Tab label="Consentimentos" />
          <Tab label="Solicitações" />
          <Tab label="Base legal" />
        </Tabs>
        <CardContent>
          {tab === 0 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Evento</TableCell>
                  <TableCell>Participante</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Versão</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {consentimentos.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{TIPO_CONSENTIMENTO[c.tipo] || c.tipo}</TableCell>
                    <TableCell>{c.evento}</TableCell>
                    <TableCell>{c.participante}</TableCell>
                    <TableCell>{formatDate(c.dataConsentimento)}</TableCell>
                    <TableCell>{c.versao}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {tab === 1 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Solicitante</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Data solicitação</TableCell>
                  <TableCell>Prazo / Conclusão</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {solicitacoes.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.tipo === 'exclusao' ? 'Direito ao esquecimento' : 'Portabilidade'}</TableCell>
                    <TableCell>{s.solicitante}</TableCell>
                    <TableCell>
                      <Chip
                        label={s.status}
                        size="small"
                        color={s.status === 'concluido' ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>{formatDate(s.dataSolicitacao)}</TableCell>
                    <TableCell>
                      {s.status === 'pendente' && s.prazoResposta
                        ? formatDate(s.prazoResposta)
                        : s.dataConclusao
                          ? formatDate(s.dataConclusao)
                          : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {tab === 2 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Finalidade</TableCell>
                  <TableCell>Base legal</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Retenção</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {baseLegal.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.finalidade}</TableCell>
                    <TableCell>{b.baseLegal}</TableCell>
                    <TableCell>{b.categoria}</TableCell>
                    <TableCell>{b.retencao}</TableCell>
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
