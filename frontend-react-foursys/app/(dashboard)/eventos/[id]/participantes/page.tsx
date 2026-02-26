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
  TextField,
  InputAdornment,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';

// ─── Mock do evento (consistente com fluxo-demonstracao) ──────────────────────

const MOCK_EVENTO = {
  id: 'ev-demo-001',
  nome: 'Workshop de Harmonização Facial Avançada',
  tipo: 'Workshop Clínico',
  formato: 'Presencial',
  data: '22 de Março de 2026 · 08h00–17h00',
  local: 'Clínica Alur Medical — Av. Paulista, 1234, São Paulo/SP',
  vagas: 20,
  professor: 'Dr. Ricardo Mendes',
};

interface Participante {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  inscritoEm: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
  presenca: boolean;
}

const MOCK_PARTICIPANTES: Participante[] = [
  { id: 'p1', nome: 'Ana Paula Ferreira', email: 'ana.ferreira@email.com', telefone: '(11) 99123-4567', inscritoEm: '20/03/2026 às 14h32', status: 'confirmado', presenca: true },
  { id: 'p2', nome: 'Carlos Eduardo Lima', email: 'carlos.lima@email.com', telefone: '(11) 98765-4321', inscritoEm: '20/03/2026 às 15h10', status: 'confirmado', presenca: true },
  { id: 'p3', nome: 'Fernanda Costa', email: 'fernanda.costa@email.com', telefone: '(21) 97654-3210', inscritoEm: '21/03/2026 às 09h45', status: 'confirmado', presenca: false },
  { id: 'p4', nome: 'João Victor Santos', email: 'joao.santos@email.com', telefone: '(11) 96543-2109', inscritoEm: '21/03/2026 às 11h20', status: 'confirmado', presenca: true },
  { id: 'p5', nome: 'Mariana Oliveira', email: 'mariana.oliveira@email.com', telefone: '(31) 95432-1098', inscritoEm: '21/03/2026 às 16h05', status: 'confirmado', presenca: false },
  { id: 'p6', nome: 'Beatriz Mendes', email: 'beatriz.mendes@email.com', telefone: '(11) 94321-0987', inscritoEm: '21/03/2026 às 18h30', status: 'confirmado', presenca: false },
  { id: 'p7', nome: 'Rafael Torres', email: 'rafael.torres@email.com', telefone: '(11) 93210-9876', inscritoEm: '22/03/2026 às 07h15', status: 'confirmado', presenca: true },
];

const STATUS_CFG = {
  confirmado: { label: 'Confirmado', bg: '#E6FDF1', color: '#16A34A' },
  pendente:   { label: 'Pendente',   bg: '#FFF3CD', color: '#856404' },
  cancelado:  { label: 'Cancelado',  bg: '#FEE2E2', color: '#DC2626' },
};

const BRAND = '#7B1CE5';
const ACCENT = '#16A34A';

export default function GestaoParticipantesPage() {
  const params = useParams();
  const id = params.id as string;
  const isMock = id === 'ev-demo-001';

  const [participantes, setParticipantes] = useState<Participante[]>(MOCK_PARTICIPANTES);
  const [busca, setBusca] = useState('');
  const [removeDialog, setRemoveDialog] = useState<Participante | null>(null);

  const filtrados = participantes.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.email.toLowerCase().includes(busca.toLowerCase())
  );

  const confirmados = participantes.filter(p => p.status === 'confirmado').length;
  const presentes   = participantes.filter(p => p.presenca).length;

  const handleRemover = () => {
    if (!removeDialog) return;
    setParticipantes(prev => prev.filter(p => p.id !== removeDialog.id));
    setRemoveDialog(null);
  };

  if (!isMock) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Gestão de participantes</Typography>
          <Button component={Link} href={`/eventos/${id}`} startIcon={<ArrowBackIcon />}>Voltar</Button>
        </Box>
        <Card>
          <CardContent>
            <Typography color="text.secondary">Lista de participantes do evento.</Typography>
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
            <PeopleIcon sx={{ color: BRAND }} /> Gestão de Participantes
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>{MOCK_EVENTO.nome}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<FileDownloadIcon />} sx={{ borderRadius: 9999 }}>
            Exportar CSV
          </Button>
          <Button component={Link} href={`/eventos/${id}`} variant="outlined" startIcon={<ArrowBackIcon />} sx={{ borderRadius: 9999 }}>
            Voltar ao Evento
          </Button>
        </Box>
      </Box>

      {/* Info do evento */}
      <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid #EEF2FF', boxShadow: '0 4px 14px rgba(15,23,42,0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {[
              { icon: <EventIcon fontSize="small" />, label: 'Evento', value: MOCK_EVENTO.nome },
              { icon: <CalendarTodayIcon fontSize="small" />, label: 'Data', value: MOCK_EVENTO.data },
              { icon: <LocationOnIcon fontSize="small" />, label: 'Local', value: MOCK_EVENTO.local },
              { icon: <SchoolIcon fontSize="small" />, label: 'Professor', value: MOCK_EVENTO.professor },
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
          { icon: <GroupIcon />,       label: 'Total Inscritos',  value: participantes.length, bg: '#EEF2FF', color: BRAND },
          { icon: <CheckCircleIcon />, label: 'Confirmados',      value: confirmados,           bg: '#E6FDF1', color: ACCENT },
          { icon: <PeopleIcon />,      label: 'Presença no Dia',  value: presentes,             bg: '#FFF3E0', color: '#E65100' },
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

      {/* Ocupação */}
      <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid #EEF2FF', boxShadow: '0 4px 14px rgba(15,23,42,0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight={600}>Ocupação do evento</Typography>
            <Typography variant="body2" color="text.secondary">
              {participantes.length} / {MOCK_EVENTO.vagas} vagas ({Math.round((participantes.length / MOCK_EVENTO.vagas) * 100)}%)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(participantes.length / MOCK_EVENTO.vagas) * 100}
            sx={{ height: 8, borderRadius: 4, bgcolor: '#E6FDF1', '& .MuiLinearProgress-bar': { bgcolor: ACCENT } }}
          />
        </CardContent>
      </Card>

      {/* Lista */}
      <Card sx={{ borderRadius: 3, border: '1px solid #EEF2FF', boxShadow: '0 4px 14px rgba(15,23,42,0.05)' }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Typography fontWeight={700}>Lista de Participantes ({filtrados.length})</Typography>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Buscar por nome ou e-mail…"
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                  sx={{ width: 280 }}
                />
                <Button variant="contained" startIcon={<PersonAddIcon />}
                  sx={{ borderRadius: 9999, bgcolor: BRAND, '&:hover': { bgcolor: '#6B11D4' }, whiteSpace: 'nowrap' }}>
                  Adicionar
                </Button>
              </Box>
            </Box>
          }
          sx={{ pb: 0 }}
        />
        <CardContent sx={{ pt: 1 }}>
          <Box>
            {filtrados.map((p, idx) => {
              const cfg = STATUS_CFG[p.status];
              return (
                <Box key={p.id}>
                  {idx > 0 && <Divider sx={{ my: 0.5 }} />}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.25, flexWrap: 'wrap' }}>
                    <Avatar sx={{ bgcolor: BRAND, width: 40, height: 40, fontWeight: 700 }}>{p.nome[0]}</Avatar>
                    <Box flex={1} minWidth={160}>
                      <Typography variant="body2" fontWeight={700}>{p.nome}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                        <EmailIcon sx={{ fontSize: 12, color: '#94A3B8' }} />
                        <Typography variant="caption" color="text.secondary">{p.email}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mx: 0.5 }}>·</Typography>
                        <Typography variant="caption" color="text.secondary">{p.telefone}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right', minWidth: 140 }}>
                      <Typography variant="caption" color="text.secondary" display="block">Inscrito em</Typography>
                      <Typography variant="caption" fontWeight={600}>{p.inscritoEm}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={cfg.label}
                        size="small"
                        sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 700 }}
                      />
                      {p.presenca && (
                        <Chip
                          icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: `${ACCENT} !important` }} />}
                          label="Presente"
                          size="small"
                          sx={{ bgcolor: '#E6FDF1', color: ACCENT, fontWeight: 700 }}
                        />
                      )}
                    </Box>
                    <Tooltip title="Remover participante">
                      <IconButton size="small" onClick={() => setRemoveDialog(p)} sx={{ color: '#DC2626', '&:hover': { bgcolor: '#FEE2E2' } }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              );
            })}
            {filtrados.length === 0 && (
              <Box sx={{ py: 4, textAlign: 'center', color: '#94A3B8' }}>
                <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography>Nenhum participante encontrado</Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Dialog de remoção */}
      <Dialog open={!!removeDialog} onClose={() => setRemoveDialog(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>Remover participante?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Tem certeza que deseja remover <strong>{removeDialog?.nome}</strong> da lista de participantes? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setRemoveDialog(null)} variant="outlined" sx={{ borderRadius: 9999 }}>Cancelar</Button>
          <Button onClick={handleRemover} variant="contained" color="error" sx={{ borderRadius: 9999 }}>Remover</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
