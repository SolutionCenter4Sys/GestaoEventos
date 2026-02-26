'use client';

import { useState, useEffect } from 'react';
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
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { httpClient } from '@/data/http/httpClient';

interface LogAuditoria {
  id: string;
  usuario: string;
  usuarioNome: string;
  acao: string;
  recurso: string;
  recursoId?: string;
  detalhes: string;
  ip?: string;
  dataHora: string;
}

const ACAO_LABELS: Record<string, string> = {
  visualizou_dados_sensiveis: 'Visualizou dados sensíveis',
  editou: 'Editou',
  aprovou: 'Aprovou',
  exportou: 'Exportou',
  criou: 'Criou',
  acessou: 'Acessou',
  visualizou: 'Visualizou',
  revisou_documento: 'Revisou documento',
  login: 'Login',
  tentativa_login_falha: 'Tentativa login falha',
};

const getAcaoColor = (acao: string) => {
  if (acao.includes('falha')) return 'error';
  if (['aprovou', 'criou', 'login'].includes(acao)) return 'success';
  if (['editou', 'revisou_documento', 'exportou'].includes(acao)) return 'info';
  if (['visualizou_dados_sensiveis'].includes(acao)) return 'warning';
  return 'default';
};

export default function LogsAcessoPage() {
  const [logs, setLogs] = useState<LogAuditoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    httpClient.get<LogAuditoria[]>('/logs-auditoria').then(
      (res) => { setLogs(res.data || []); setLoading(false); },
      () => setLoading(false)
    );
  }, []);

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }) : '-';

  const logsFiltrados = filtro
    ? logs.filter(
        (l) =>
          l.usuario.toLowerCase().includes(filtro.toLowerCase()) ||
          l.usuarioNome.toLowerCase().includes(filtro.toLowerCase()) ||
          l.acao.toLowerCase().includes(filtro.toLowerCase()) ||
          l.recurso.toLowerCase().includes(filtro.toLowerCase()) ||
          l.detalhes.toLowerCase().includes(filtro.toLowerCase())
      )
    : logs;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Auditoria e Logs
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Registros de acesso e auditoria. Ações críticas (criar/editar/excluir, acesso a dados sensíveis).
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <TextField
            placeholder="Buscar por usuário, ação, recurso..."
            size="small"
            fullWidth
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : logsFiltrados.length === 0 ? (
            <Typography color="text.secondary">Nenhum log encontrado.</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Data/hora</TableCell>
                  <TableCell>Usuário</TableCell>
                  <TableCell>Ação</TableCell>
                  <TableCell>Recurso</TableCell>
                  <TableCell>Detalhes</TableCell>
                  <TableCell>IP</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logsFiltrados.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(log.dataHora)}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>{log.usuarioNome}</Typography>
                      <Typography variant="caption" color="text.secondary">{log.usuario}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ACAO_LABELS[log.acao] || log.acao}
                        size="small"
                        color={getAcaoColor(log.acao) as never}
                      />
                    </TableCell>
                    <TableCell>
                      {log.recursoId ? `${log.recurso} (${log.recursoId})` : log.recurso}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>{log.detalhes}</TableCell>
                    <TableCell>{log.ip || '-'}</TableCell>
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
