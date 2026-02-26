'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

// ─── Mock do evento (consistente com fluxo-demonstracao) ──────────────────────

const MOCK_EVENTO = {
  id: 'ev-demo-001',
  nome: 'Workshop de Harmonização Facial Avançada',
  tipo: 'Workshop Clínico',
  formato: 'Presencial',
  data: '22 de Março de 2026 · 08h00–17h00',
  local: 'Clínica Alur Medical — Av. Paulista, 1234, São Paulo/SP',
  vagas: 20,
  vagasOcupadas: 7,
  professor: 'Dr. Ricardo Mendes',
};

interface PessoaEspera {
  id: string;
  posicao: number;
  nome: string;
  email: string;
  telefone: string;
  inscritoEm: string;
  notificado: boolean;
}

const LISTA_INICIAL: PessoaEspera[] = [
  { id: 'e1', posicao: 1, nome: 'Priscila Nunes',      email: 'priscila.nunes@email.com',    telefone: '(11) 92345-6789', inscritoEm: '21/03/2026 às 19h12', notificado: false },
  { id: 'e2', posicao: 2, nome: 'Gabriela Rocha',       email: 'gabriela.rocha@email.com',    telefone: '(21) 91234-5678', inscritoEm: '21/03/2026 às 20h45', notificado: false },
  { id: 'e3', posicao: 3, nome: 'Lucas Almeida',        email: 'lucas.almeida@email.com',     telefone: '(11) 90123-4567', inscritoEm: '22/03/2026 às 06h30', notificado: false },
  { id: 'e4', posicao: 4, nome: 'Thaís Rodrigues',      email: 'thais.rodrigues@email.com',   telefone: '(31) 99876-5432', inscritoEm: '22/03/2026 às 07h05', notificado: false },
  { id: 'e5', posicao: 5, nome: 'Diego Pereira',        email: 'diego.pereira@email.com',     telefone: '(11) 98765-4321', inscritoEm: '22/03/2026 às 07h48', notificado: false },
];

const BRAND  = '#7B1CE5';
const ACCENT = '#16A34A';
const ORANGE = '#E65100';

export default function ListaEsperaPage() {
  const params = useParams();
  const id = params.id as string;
  const isMock = id === 'ev-demo-001';

  const [lista, setLista] = useState<PessoaEspera[]>(LISTA_INICIAL);
  const [promoverDialog, setPromoverDialog] = useState<PessoaEspera | null>(null);
  const [removeDialog, setRemoveDialog]     = useState<PessoaEspera | null>(null);
  const [snack, setSnack] = useState('');

  const vagasLivres = MOCK_EVENTO.vagas - MOCK_EVENTO.vagasOcupadas;

  const handleNotificar = (pessoa: PessoaEspera) => {
    setLista(prev => prev.map(p => p.id === pessoa.id ? { ...p, notificado: true } : p));
    setSnack(`Notificação enviada para ${pessoa.nome}!`);
    setTimeout(() => setSnack(''), 3000);
  };

  const handlePromover = () => {
    if (!promoverDialog) return;
    setLista(prev => {
      const filtered = prev.filter(p => p.id !== promoverDialog.id);
      return filtered.map((p, i) => ({ ...p, posicao: i + 1 }));
    });
    setSnack(`${promoverDialog.nome} promovido(a) para participante confirmado!`);
    setTimeout(() => setSnack(''), 3500);
    setPromoverDialog(null);
  };

  const handleRemover = () => {
    if (!removeDialog) return;
    setLista(prev => {
      const filtered = prev.filter(p => p.id !== removeDialog.id);
      return filtered.map((p, i) => ({ ...p, posicao: i + 1 }));
    });
    setRemoveDialog(null);
  };

  if (!isMock) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Lista de espera</Typography>
          <Button component={Link} href={`/eventos/${id}`} startIcon={<ArrowBackIcon />}>Voltar</Button>
        </Box>
        <Card>
          <CardContent>
            <Typography color="text.secondary">Lista de espera do evento.</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HourglassEmptyIcon sx={{ color: ORANGE }} /> Lista de Espera
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>{MOCK_EVENTO.nome}</Typography>
        </Box>
        <Button component={Link} href={`/eventos/${id}`} variant="outlined" startIcon={<ArrowBackIcon />} sx={{ borderRadius: 9999 }}>
          Voltar ao Evento
        </Button>
      </Box>

      {/* Info do evento */}
      <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid #EEF2FF', boxShadow: '0 4px 14px rgba(15,23,42,0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {[
              { icon: <EventIcon fontSize="small" />,         label: 'Evento',   value: MOCK_EVENTO.nome },
              { icon: <CalendarTodayIcon fontSize="small" />, label: 'Data',     value: MOCK_EVENTO.data },
              { icon: <SchoolIcon fontSize="small" />,        label: 'Professor',value: MOCK_EVENTO.professor },
              { icon: <GroupIcon fontSize="small" />,         label: 'Vagas',    value: `${MOCK_EVENTO.vagasOcupadas} / ${MOCK_EVENTO.vagas} ocupadas` },
            ].map(item => (
              <Box key={item.label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box sx={{ color: BRAND, mt: 0.2, flexShrink: 0 }}>{item.icon}</Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>{item.label}</Typography>
                  <Typography variant="body2" fontWeight={600}>{item.value}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Métricas */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
        {[
          { icon: <HourglassEmptyIcon />, label: 'Na Lista de Espera', value: lista.length,  bg: '#FFF3E0', color: ORANGE },
          { icon: <GroupIcon />,          label: 'Vagas Disponíveis',  value: vagasLivres,   bg: '#E6FDF1', color: ACCENT },
          { icon: <NotificationsActiveIcon />, label: 'Notificados',   value: lista.filter(p => p.notificado).length, bg: '#EEF2FF', color: BRAND },
        ].map(m => (
          <Card key={m.label} sx={{ borderRadius: 3, border: '1px solid #EEF2FF', boxShadow: '0 4px 14px rgba(15,23,42,0.05)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '16px !important' }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color }}>
                {m.icon}
              </Box>
              <Box>
                <Typography fontWeight={700} fontSize="1.5rem">{m.value}</Typography>
                <Typography variant="caption" color="text.secondary">{m.label}</Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Banner automação */}
      <Alert
        icon={<AutoAwesomeIcon />}
        sx={{ mb: 3, borderRadius: 3, bgcolor: '#EEF2FF', border: '1px solid #C7D2FE', '& .MuiAlert-icon': { color: BRAND } }}
      >
        <Typography variant="body2">
          <strong style={{ color: BRAND }}>Gestão Automática:</strong>{' '}
          Quando uma vaga se abre por cancelamento, o sistema notifica automaticamente o primeiro da fila por e-mail com um link de confirmação válido por 24h.
        </Typography>
      </Alert>

      {/* Alerta de vagas livres */}
      {vagasLivres > 0 && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
          <Typography variant="body2">
            Há <strong>{vagasLivres} {vagasLivres === 1 ? 'vaga disponível' : 'vagas disponíveis'}</strong>! Você pode promover {vagasLivres === 1 ? 'o primeiro' : 'os primeiros'} da lista de espera.
          </Typography>
        </Alert>
      )}

      {/* Lista */}
      <Card sx={{ borderRadius: 3, border: '1px solid #EEF2FF', boxShadow: '0 4px 14px rgba(15,23,42,0.05)' }}>
        <CardHeader
          avatar={<HourglassEmptyIcon sx={{ color: ORANGE }} />}
          title={<Typography fontWeight={700}>Pessoas na Fila de Espera ({lista.length})</Typography>}
          subheader="Ordenados por data de inscrição"
        />
        <CardContent sx={{ pt: 0 }}>
          {lista.length === 0 ? (
            <Box sx={{ py: 5, textAlign: 'center', color: '#94A3B8' }}>
              <HourglassEmptyIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography>Nenhuma pessoa na lista de espera</Typography>
            </Box>
          ) : (
            lista.map((pessoa, idx) => (
              <Box key={pessoa.id}>
                {idx > 0 && <Divider sx={{ my: 0.5 }} />}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, flexWrap: 'wrap' }}>
                  {/* Posição */}
                  <Box sx={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    bgcolor: pessoa.posicao === 1 ? '#FFF3E0' : '#F1F5F9',
                    color: pessoa.posicao === 1 ? ORANGE : '#64748B',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.9rem',
                    border: pessoa.posicao === 1 ? `2px solid ${ORANGE}` : '2px solid #E2E8F0',
                  }}>
                    {pessoa.posicao}°
                  </Box>

                  <Avatar sx={{ bgcolor: BRAND, width: 40, height: 40, fontWeight: 700 }}>{pessoa.nome[0]}</Avatar>

                  <Box flex={1} minWidth={160}>
                    <Typography variant="body2" fontWeight={700}>{pessoa.nome}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                      <EmailIcon sx={{ fontSize: 12, color: '#94A3B8' }} />
                      <Typography variant="caption" color="text.secondary">{pessoa.email}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mx: 0.5 }}>·</Typography>
                      <Typography variant="caption" color="text.secondary">{pessoa.telefone}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ textAlign: 'right', minWidth: 150 }}>
                    <Typography variant="caption" color="text.secondary" display="block">Entrou na fila</Typography>
                    <Typography variant="caption" fontWeight={600}>{pessoa.inscritoEm}</Typography>
                  </Box>

                  {pessoa.notificado && (
                    <Chip
                      icon={<NotificationsActiveIcon sx={{ fontSize: '14px !important', color: `${BRAND} !important` }} />}
                      label="Notificado"
                      size="small"
                      sx={{ bgcolor: '#EEF2FF', color: BRAND, fontWeight: 700 }}
                    />
                  )}

                  <Box sx={{ display: 'flex', gap: 0.75 }}>
                    {!pessoa.notificado && (
                      <Tooltip title="Notificar por e-mail">
                        <Button
                          size="small" variant="outlined"
                          startIcon={<NotificationsActiveIcon fontSize="small" />}
                          onClick={() => handleNotificar(pessoa)}
                          sx={{ borderRadius: 9999, fontSize: '0.72rem', borderColor: BRAND, color: BRAND }}
                        >
                          Notificar
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip title="Promover para participante">
                      <IconButton size="small" onClick={() => setPromoverDialog(pessoa)} sx={{ color: ACCENT, '&:hover': { bgcolor: '#E6FDF1' } }}>
                        <ArrowUpwardIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remover da fila">
                      <IconButton size="small" onClick={() => setRemoveDialog(pessoa)} sx={{ color: '#DC2626', '&:hover': { bgcolor: '#FEE2E2' } }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      {/* Dialog promover */}
      <Dialog open={!!promoverDialog} onClose={() => setPromoverDialog(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon sx={{ color: ACCENT }} /> Promover para Participante?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            <strong>{promoverDialog?.nome}</strong> será movido(a) da lista de espera para a lista de participantes confirmados do evento.
            Um e-mail de confirmação será enviado automaticamente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setPromoverDialog(null)} variant="outlined" sx={{ borderRadius: 9999 }}>Cancelar</Button>
          <Button onClick={handlePromover} variant="contained"
            sx={{ borderRadius: 9999, bgcolor: ACCENT, '&:hover': { bgcolor: '#15803D' } }}
            startIcon={<CheckCircleIcon />}>Confirmar Promoção</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog remover */}
      <Dialog open={!!removeDialog} onClose={() => setRemoveDialog(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>Remover da lista de espera?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Tem certeza que deseja remover <strong>{removeDialog?.nome}</strong> da lista de espera?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setRemoveDialog(null)} variant="outlined" sx={{ borderRadius: 9999 }}>Cancelar</Button>
          <Button onClick={handleRemover} variant="contained" color="error" sx={{ borderRadius: 9999 }}>Remover</Button>
        </DialogActions>
      </Dialog>

      {/* Snack simples */}
      {snack && (
        <Box sx={{
          position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          bgcolor: '#0F172A', color: '#fff', px: 3, py: 1.5, borderRadius: 2,
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)', zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 280,
        }}>
          <CheckCircleIcon sx={{ color: ACCENT, fontSize: 20 }} />
          <Typography variant="body2">{snack}</Typography>
        </Box>
      )}
    </Box>
  );
}
