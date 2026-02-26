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
  LinearProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import SendIcon from '@mui/icons-material/Send';
import InfoIcon from '@mui/icons-material/Info';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

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
  cargaHoraria: '8 horas',
};

interface Certificado {
  id: string;
  nome: string;
  email: string;
  emitidoEm: string;
  status: 'emitido' | 'pendente';
  nota: number;
  enviado: boolean;
}

const CERTIFICADOS: Certificado[] = [
  { id: 'c1', nome: 'Ana Paula Ferreira',  email: 'ana.ferreira@email.com',  emitidoEm: '22/03/2026 às 17h45', status: 'emitido', nota: 5, enviado: true },
  { id: 'c2', nome: 'Carlos Eduardo Lima', email: 'carlos.lima@email.com',   emitidoEm: '22/03/2026 às 17h45', status: 'emitido', nota: 4, enviado: true },
  { id: 'c3', nome: 'João Victor Santos',  email: 'joao.santos@email.com',   emitidoEm: '22/03/2026 às 17h46', status: 'emitido', nota: 5, enviado: true },
  { id: 'c4', nome: 'Rafael Torres',       email: 'rafael.torres@email.com', emitidoEm: '22/03/2026 às 17h46', status: 'emitido', nota: 4, enviado: false },
  { id: 'c5', nome: 'Fernanda Costa',      email: 'fernanda.costa@email.com', emitidoEm: '—',                  status: 'pendente', nota: 0, enviado: false },
  { id: 'c6', nome: 'Mariana Oliveira',    email: 'mariana.oliveira@email.com', emitidoEm: '—',                status: 'pendente', nota: 0, enviado: false },
];

const BRAND  = '#7B1CE5';
const ACCENT = '#16A34A';
const TEAL   = '#00695C';

function Estrelas({ nota }: { nota: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
      {[1, 2, 3, 4, 5].map(i =>
        i <= nota
          ? <StarIcon key={i} sx={{ color: '#F59E0B', fontSize: 16 }} />
          : <StarOutlineIcon key={i} sx={{ color: '#CBD5E1', fontSize: 16 }} />
      )}
    </Box>
  );
}

export default function CertificadosEventoPage() {
  const params = useParams();
  const id = params.id as string;
  const isMock = id === 'ev-demo-001';

  const [certificados, setCertificados] = useState<Certificado[]>(CERTIFICADOS);

  const emitidos  = certificados.filter(c => c.status === 'emitido').length;
  const pendentes = certificados.filter(c => c.status === 'pendente').length;
  const enviados  = certificados.filter(c => c.enviado).length;

  const handleEnviar = (cert: Certificado) => {
    setCertificados(prev => prev.map(c => c.id === cert.id ? { ...c, enviado: true } : c));
  };

  const handleEmitir = (cert: Certificado) => {
    const now = new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setCertificados(prev => prev.map(c =>
      c.id === cert.id ? { ...c, status: 'emitido' as const, emitidoEm: now, nota: 4 } : c
    ));
  };

  if (!isMock) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Certificados do evento</Typography>
          <Button component={Link} href={`/eventos/${id}`} startIcon={<ArrowBackIcon />}>Voltar</Button>
        </Box>
        <Card>
          <CardContent>
            <Typography color="text.secondary">Emissão de certificados.</Typography>
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
            <EmojiEventsIcon sx={{ color: TEAL }} /> Certificados do Evento
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>{MOCK_EVENTO.nome}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderRadius: 9999 }}>
            Baixar Todos (ZIP)
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
              { icon: <EventIcon fontSize="small" />,        label: 'Evento',        value: MOCK_EVENTO.nome },
              { icon: <CalendarTodayIcon fontSize="small" />, label: 'Data',          value: MOCK_EVENTO.data },
              { icon: <SchoolIcon fontSize="small" />,        label: 'Professor',     value: MOCK_EVENTO.professor },
              { icon: <LocationOnIcon fontSize="small" />,    label: 'Carga Horária', value: MOCK_EVENTO.cargaHoraria },
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
          { icon: <VerifiedIcon />,      label: 'Certificados Emitidos', value: emitidos,  bg: '#E0F2F1', color: TEAL },
          { icon: <EmailIcon />,         label: 'E-mails Enviados',      value: enviados,  bg: '#E6FDF1', color: ACCENT },
          { icon: <InfoIcon />,          label: 'Pendentes de Emissão',  value: pendentes, bg: '#FEE2E2', color: '#DC2626' },
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

      {/* Progresso */}
      <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid #EEF2FF', boxShadow: '0 4px 14px rgba(15,23,42,0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight={600}>Progresso da certificação</Typography>
            <Typography variant="body2" color="text.secondary">
              {emitidos} / {certificados.length} emitidos ({Math.round((emitidos / certificados.length) * 100)}%)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(emitidos / certificados.length) * 100}
            sx={{ height: 8, borderRadius: 4, bgcolor: '#E0F2F1', '& .MuiLinearProgress-bar': { bgcolor: TEAL } }}
          />
        </CardContent>
      </Card>

      {/* Banner de automação */}
      <Alert
        icon={<AutoAwesomeIcon />}
        sx={{ mb: 3, borderRadius: 3, bgcolor: '#F3E5F5', border: '1px solid #CE93D8', '& .MuiAlert-icon': { color: BRAND } }}
      >
        <Typography variant="body2">
          <strong style={{ color: BRAND }}>Certificação Automática:</strong>{' '}
          Os certificados são emitidos automaticamente ao final do evento para todos os participantes com presença confirmada no check-in.
        </Typography>
      </Alert>

      {/* Lista de certificados */}
      <Card sx={{ borderRadius: 3, border: '1px solid #EEF2FF', boxShadow: '0 4px 14px rgba(15,23,42,0.05)' }}>
        <CardHeader
          avatar={<WorkspacePremiumIcon sx={{ color: TEAL }} />}
          title={<Typography fontWeight={700}>Lista de Certificados ({certificados.length})</Typography>}
        />
        <CardContent sx={{ pt: 0 }}>
          {certificados.map((cert, idx) => (
            <Box key={cert.id}>
              {idx > 0 && <Divider sx={{ my: 0.5 }} />}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, flexWrap: 'wrap' }}>
                <Avatar sx={{ bgcolor: cert.status === 'emitido' ? TEAL : '#CBD5E1', width: 40, height: 40, fontWeight: 700 }}>
                  {cert.status === 'emitido' ? <WorkspacePremiumIcon sx={{ fontSize: 22 }} /> : cert.nome[0]}
                </Avatar>

                <Box flex={1} minWidth={160}>
                  <Typography variant="body2" fontWeight={700}>{cert.nome}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmailIcon sx={{ fontSize: 12, color: '#94A3B8' }} />
                    <Typography variant="caption" color="text.secondary">{cert.email}</Typography>
                  </Box>
                </Box>

                {cert.status === 'emitido' && (
                  <Box sx={{ textAlign: 'right', minWidth: 150 }}>
                    <Typography variant="caption" color="text.secondary" display="block">Emitido em</Typography>
                    <Typography variant="caption" fontWeight={600}>{cert.emitidoEm}</Typography>
                  </Box>
                )}

                {cert.status === 'emitido' && cert.nota > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" mb={0.25}>Avaliação</Typography>
                    <Estrelas nota={cert.nota} />
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {cert.status === 'emitido' ? (
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: `${TEAL} !important` }} />}
                      label="Emitido"
                      size="small"
                      sx={{ bgcolor: '#E0F2F1', color: TEAL, fontWeight: 700 }}
                    />
                  ) : (
                    <Chip label="Pendente" size="small" sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 700 }} />
                  )}

                  {cert.status === 'emitido' && cert.enviado && (
                    <Chip
                      icon={<EmailIcon sx={{ fontSize: '14px !important', color: `${ACCENT} !important` }} />}
                      label="Enviado"
                      size="small"
                      sx={{ bgcolor: '#E6FDF1', color: ACCENT, fontWeight: 700 }}
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  {cert.status === 'pendente' && (
                    <Button
                      size="small" variant="contained"
                      onClick={() => handleEmitir(cert)}
                      sx={{ borderRadius: 9999, fontSize: '0.75rem', bgcolor: TEAL, '&:hover': { bgcolor: '#00574B' } }}
                    >
                      Emitir
                    </Button>
                  )}
                  {cert.status === 'emitido' && !cert.enviado && (
                    <Tooltip title="Enviar por e-mail">
                      <IconButton size="small" onClick={() => handleEnviar(cert)} sx={{ color: ACCENT }}>
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {cert.status === 'emitido' && (
                    <Tooltip title="Baixar PDF">
                      <IconButton size="small" sx={{ color: '#64748B' }}>
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
