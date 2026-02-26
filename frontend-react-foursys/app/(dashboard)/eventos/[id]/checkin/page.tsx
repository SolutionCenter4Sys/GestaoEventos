'use client';

import { useState, useMemo } from 'react';
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
  LinearProgress,
  TextField,
  InputAdornment,
  Tooltip,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import ChecklistIcon from '@mui/icons-material/Checklist';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EmailIcon from '@mui/icons-material/Email';
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
};

interface Participante {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  inscritoEm: string;
  presente: boolean;
  horarioCheckin?: string;
  geoStatus?: 'dentro' | 'fora' | 'erro';
  distanciaKm?: number;
  geoMensagem?: string;
}

const PARTICIPANTES_INICIAIS: Participante[] = [
  { id: 'p1', nome: 'Ana Paula Ferreira',  email: 'ana.ferreira@email.com',     telefone: '(11) 99123-4567', inscritoEm: '20/03/2026', presente: true,  horarioCheckin: '08h02' },
  { id: 'p2', nome: 'Carlos Eduardo Lima', email: 'carlos.lima@email.com',      telefone: '(11) 98765-4321', inscritoEm: '20/03/2026', presente: true,  horarioCheckin: '08h07' },
  { id: 'p3', nome: 'Fernanda Costa',      email: 'fernanda.costa@email.com',   telefone: '(21) 97654-3210', inscritoEm: '21/03/2026', presente: false, horarioCheckin: undefined },
  { id: 'p4', nome: 'João Victor Santos',  email: 'joao.santos@email.com',      telefone: '(11) 96543-2109', inscritoEm: '21/03/2026', presente: true,  horarioCheckin: '08h15' },
  { id: 'p5', nome: 'Mariana Oliveira',    email: 'mariana.oliveira@email.com', telefone: '(31) 95432-1098', inscritoEm: '21/03/2026', presente: false, horarioCheckin: undefined },
  { id: 'p6', nome: 'Beatriz Mendes',      email: 'beatriz.mendes@email.com',   telefone: '(11) 94321-0987', inscritoEm: '21/03/2026', presente: false, horarioCheckin: undefined },
  { id: 'p7', nome: 'Rafael Torres',       email: 'rafael.torres@email.com',    telefone: '(11) 93210-9876', inscritoEm: '22/03/2026', presente: true,  horarioCheckin: '08h22' },
];

const BRAND  = '#7B1CE5';
const ACCENT = '#16A34A';
const ORANGE = '#E65100';
const RAIO_MAXIMO_KM = 2;
// Coordenadas aproximadas: Av. Paulista, 1234 - Sao Paulo/SP
const COORDENADAS_EVENTO = { lat: -23.561684, lng: -46.656139 };

function toRad(valor: number) {
  return (valor * Math.PI) / 180;
}

function calcularDistanciaKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371; // raio medio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function obterPosicaoAtual() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

export default function CheckInPage() {
  const params = useParams();
  const id = params.id as string;
  const isMock = id === 'ev-demo-001';

  const [participantes, setParticipantes] = useState<Participante[]>(PARTICIPANTES_INICIAIS);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<'todos' | 'presentes' | 'ausentes'>('todos');
  const [snack, setSnack] = useState('');
  const [validandoGeoId, setValidandoGeoId] = useState<string | null>(null);

  const presentes = useMemo(() => participantes.filter(p => p.presente), [participantes]);
  const ausentes  = useMemo(() => participantes.filter(p => !p.presente), [participantes]);
  const geoValidados = useMemo(() => participantes.filter(p => p.geoStatus === 'dentro').length, [participantes]);
  const geoBloqueados = useMemo(() => participantes.filter(p => p.geoStatus === 'fora').length, [participantes]);
  const geoFalhas = useMemo(() => participantes.filter(p => p.geoStatus === 'erro').length, [participantes]);

  const filtrados = useMemo(() => {
    let lista = participantes;
    if (filtro === 'presentes') lista = presentes;
    if (filtro === 'ausentes')  lista = ausentes;
    if (busca) lista = lista.filter(p =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.email.toLowerCase().includes(busca.toLowerCase())
    );
    return lista;
  }, [participantes, presentes, ausentes, filtro, busca]);

  const percentual = participantes.length > 0
    ? Math.round((presentes.length / participantes.length) * 100)
    : 0;

  const handleCheckIn = async (p: Participante) => {
    if (!navigator.geolocation) {
      setParticipantes(prev => prev.map(x =>
        x.id === p.id ? { ...x, geoStatus: 'erro', geoMensagem: 'Geolocalização não suportada neste dispositivo.' } : x
      ));
      setSnack('Dispositivo sem suporte à geolocalização.');
      setTimeout(() => setSnack(''), 3500);
      return;
    }

    setValidandoGeoId(p.id);
    try {
      const posicao = await obterPosicaoAtual();
      const distanciaKm = calcularDistanciaKm(
        posicao.coords.latitude,
        posicao.coords.longitude,
        COORDENADAS_EVENTO.lat,
        COORDENADAS_EVENTO.lng
      );

      if (distanciaKm <= RAIO_MAXIMO_KM) {
        const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
        setParticipantes(prev => prev.map(x => x.id === p.id
          ? {
              ...x,
              presente: true,
              horarioCheckin: agora,
              geoStatus: 'dentro',
              distanciaKm,
              geoMensagem: `Check-in validado. Distância ${distanciaKm.toFixed(2)} km do local do evento.`,
            }
          : x
        ));
        setSnack(`Check-in de ${p.nome} validado por geolocalização (${distanciaKm.toFixed(2)} km).`);
      } else {
        setParticipantes(prev => prev.map(x => x.id === p.id
          ? {
              ...x,
              presente: false,
              horarioCheckin: undefined,
              geoStatus: 'fora',
              distanciaKm,
              geoMensagem: `Fora do raio permitido (${distanciaKm.toFixed(2)} km). Máximo: ${RAIO_MAXIMO_KM} km.`,
            }
          : x
        ));
        setSnack(`Check-in bloqueado: ${p.nome} está a ${distanciaKm.toFixed(2)} km do local.`);
      }
    } catch {
      setParticipantes(prev => prev.map(x =>
        x.id === p.id
          ? {
              ...x,
              geoStatus: 'erro',
              geoMensagem: 'Não foi possível validar localização. Verifique permissão/GPS.',
            }
          : x
      ));
      setSnack('Falha ao validar geolocalização. Verifique permissão de localização.');
    } finally {
      setValidandoGeoId(null);
      setTimeout(() => setSnack(''), 3500);
    }
  };

  const handleDesfazer = (p: Participante) => {
    setParticipantes(prev => prev.map(x => x.id === p.id ? {
      ...x,
      presente: false,
      horarioCheckin: undefined,
      geoStatus: undefined,
      distanciaKm: undefined,
      geoMensagem: undefined,
    } : x));
    setSnack(`Check-in de ${p.nome} desfeito.`);
    setTimeout(() => setSnack(''), 3000);
  };

  if (!isMock) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Check-in de presença</Typography>
          <Button component={Link} href={`/eventos/${id}`} startIcon={<ArrowBackIcon />}>Voltar</Button>
        </Box>
        <Card>
          <CardContent>
            <Typography color="text.secondary">Registro de presença dos participantes.</Typography>
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
            <HowToRegIcon sx={{ color: ORANGE }} /> Check-in de Presença
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
              { icon: <EventIcon fontSize="small" />,         label: 'Evento',    value: MOCK_EVENTO.nome },
              { icon: <CalendarTodayIcon fontSize="small" />, label: 'Data',      value: MOCK_EVENTO.data },
              { icon: <LocationOnIcon fontSize="small" />,    label: 'Local',     value: MOCK_EVENTO.local },
              { icon: <SchoolIcon fontSize="small" />,        label: 'Professor', value: MOCK_EVENTO.professor },
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
          { icon: <GroupIcon />,      label: 'Total Inscritos', value: participantes.length, bg: '#F1F5F9', color: '#64748B' },
          { icon: <HowToRegIcon />,   label: 'Presentes',       value: presentes.length,     bg: '#E6FDF1', color: ACCENT },
          { icon: <PersonOffIcon />,  label: 'Ausentes',        value: ausentes.length,      bg: '#FEE2E2', color: '#DC2626' },
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

      {/* Barra de presença */}
      <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid #EEF2FF', boxShadow: '0 4px 14px rgba(15,23,42,0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight={600}>Taxa de presença</Typography>
            <Typography variant="body2" color="text.secondary">
              {presentes.length} de {participantes.length} presentes ({percentual}%)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={percentual}
            sx={{ height: 10, borderRadius: 4, bgcolor: '#FEE2E2', '& .MuiLinearProgress-bar': { bgcolor: ACCENT } }}
          />
        </CardContent>
      </Card>

      {/* Banner QR Code */}
      <Alert
        icon={<QrCodeScannerIcon />}
        sx={{ mb: 3, borderRadius: 3, bgcolor: '#FFF3E0', border: '1px solid #FFCC80', '& .MuiAlert-icon': { color: ORANGE } }}
      >
        <Typography variant="body2">
          <strong style={{ color: ORANGE }}>App Mobile de Check-in:</strong>{' '}
          Na versão mobile, o check-in pode ser feito via leitura de QR Code individual de cada participante para maior agilidade.
        </Typography>
      </Alert>
      <Alert
        icon={<LocationOnIcon />}
        sx={{ mb: 3, borderRadius: 3, bgcolor: '#EEF2FF', border: '1px solid #C7D2FE', '& .MuiAlert-icon': { color: BRAND } }}
      >
        <Typography variant="body2">
          <strong style={{ color: BRAND }}>Geolocalização no Check-in:</strong>{' '}
          o check-in só é validado se o participante estiver em um raio de até <strong>{RAIO_MAXIMO_KM} km</strong> do local do evento.
        </Typography>
      </Alert>
      <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(15,23,42,0.05)' }}>
        <CardContent sx={{ py: '14px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
            <Typography variant="body2" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <LocationOnIcon sx={{ color: BRAND, fontSize: 18 }} />
              Resumo da validação por geolocalização
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                size="small"
                label={`Validados: ${geoValidados}`}
                sx={{ bgcolor: '#E6FDF1', color: ACCENT, fontWeight: 700 }}
              />
              <Chip
                size="small"
                label={`Bloqueados: ${geoBloqueados}`}
                sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 700 }}
              />
              <Chip
                size="small"
                label={`Falhas: ${geoFalhas}`}
                sx={{ bgcolor: '#FFF3CD', color: '#856404', fontWeight: 700 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Banner automação pós-evento */}
      {percentual === 100 && (
        <Alert
          icon={<AutoAwesomeIcon />}
          severity="success"
          sx={{ mb: 3, borderRadius: 3 }}
        >
          <Typography variant="body2">
            <strong>Todos os participantes confirmados!</strong> Os certificados serão emitidos e enviados automaticamente ao encerrar o evento.
          </Typography>
        </Alert>
      )}

      {/* Lista */}
      <Card sx={{ borderRadius: 3, border: '1px solid #EEF2FF', boxShadow: '0 4px 14px rgba(15,23,42,0.05)' }}>
        <CardHeader
          avatar={<ChecklistIcon sx={{ color: ORANGE }} />}
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Typography fontWeight={700}>Registro de Presença ({filtrados.length})</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  size="small"
                  placeholder="Buscar participante…"
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                  sx={{ width: 230 }}
                />
                {(['todos', 'presentes', 'ausentes'] as const).map(f => (
                  <Button
                    key={f}
                    size="small"
                    variant={filtro === f ? 'contained' : 'outlined'}
                    onClick={() => setFiltro(f)}
                    sx={{
                      borderRadius: 9999, textTransform: 'capitalize', fontWeight: 600,
                      ...(filtro === f
                        ? { bgcolor: BRAND, '&:hover': { bgcolor: '#6B11D4' } }
                        : { borderColor: '#E2E8F0', color: '#64748B' })
                    }}
                  >
                    {f === 'todos' ? 'Todos' : f === 'presentes' ? 'Presentes' : 'Ausentes'}
                  </Button>
                ))}
              </Box>
            </Box>
          }
          sx={{ pb: 0 }}
        />
        <CardContent sx={{ pt: 1 }}>
          {filtrados.length === 0 ? (
            <Box sx={{ py: 5, textAlign: 'center', color: '#94A3B8' }}>
              <GroupIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography>Nenhum participante encontrado</Typography>
            </Box>
          ) : (
            filtrados.map((p, idx) => (
              <Box key={p.id}>
                {idx > 0 && <Divider sx={{ my: 0.5 }} />}
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 2, py: 1.25,
                  borderRadius: 2, px: 1,
                  bgcolor: p.presente ? '#F0FFF8' : 'transparent',
                  transition: 'background 0.2s',
                  flexWrap: 'wrap',
                }}>
                  <Avatar sx={{ bgcolor: p.presente ? ACCENT : BRAND, width: 40, height: 40, fontWeight: 700 }}>
                    {p.presente ? <HowToRegIcon sx={{ fontSize: 20 }} /> : p.nome[0]}
                  </Avatar>

                  <Box flex={1} minWidth={160}>
                    <Typography variant="body2" fontWeight={700}>{p.nome}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EmailIcon sx={{ fontSize: 12, color: '#94A3B8' }} />
                      <Typography variant="caption" color="text.secondary">{p.email}</Typography>
                    </Box>
                  </Box>

                  {p.presente && p.horarioCheckin && (
                    <Box sx={{ textAlign: 'right', minWidth: 110 }}>
                      <Typography variant="caption" color="text.secondary" display="block">Check-in às</Typography>
                      <Typography variant="caption" fontWeight={700} color={ACCENT}>{p.horarioCheckin}</Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {p.presente ? (
                      <>
                        <Chip
                          icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: `${ACCENT} !important` }} />}
                          label="Presente"
                          size="small"
                          sx={{ bgcolor: '#E6FDF1', color: ACCENT, fontWeight: 700 }}
                        />
                        <Tooltip title="Desfazer check-in">
                          <Button
                            size="small" variant="text"
                            onClick={() => handleDesfazer(p)}
                            sx={{ fontSize: '0.7rem', color: '#94A3B8', minWidth: 'auto', px: 1 }}
                          >
                            Desfazer
                          </Button>
                        </Tooltip>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<QrCodeScannerIcon fontSize="small" />}
                        onClick={() => handleCheckIn(p)}
                        disabled={validandoGeoId === p.id}
                        sx={{
                          borderRadius: 9999, fontSize: '0.78rem',
                          bgcolor: BRAND, '&:hover': { bgcolor: '#6B11D4' },
                          boxShadow: '0 2px 8px rgba(123,28,229,0.3)',
                        }}
                      >
                        {validandoGeoId === p.id ? 'Validando localização...' : 'Registrar Check-in'}
                      </Button>
                    )}
                  </Box>
                  {p.geoStatus && (
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1, pl: { xs: 0, md: 7 } }}>
                      <Chip
                        size="small"
                        label={
                          p.geoStatus === 'dentro'
                            ? `Dentro do raio (${(p.distanciaKm ?? 0).toFixed(2)} km)`
                            : p.geoStatus === 'fora'
                              ? `Fora do raio (${(p.distanciaKm ?? 0).toFixed(2)} km)`
                              : 'Falha na validação de geolocalização'
                        }
                        sx={{
                          bgcolor: p.geoStatus === 'dentro' ? '#E6FDF1' : p.geoStatus === 'fora' ? '#FEE2E2' : '#FFF3CD',
                          color: p.geoStatus === 'dentro' ? ACCENT : p.geoStatus === 'fora' ? '#DC2626' : '#856404',
                          fontWeight: 700,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {p.geoMensagem}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            ))
          )}

          {/* Rodapé com botão de encerramento */}
          {presentes.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748B', fontSize: '0.85rem' }}>
                  <EmojiEventsIcon sx={{ color: ACCENT }} />
                  <Typography variant="body2">
                    <strong>{presentes.length}</strong> participante{presentes.length !== 1 ? 's' : ''} receberá{presentes.length !== 1 ? 'ão' : ''} certificado automaticamente ao encerrar
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<EmojiEventsIcon />}
                  sx={{
                    borderRadius: 9999,
                    bgcolor: ACCENT, '&:hover': { bgcolor: '#15803D' },
                    fontWeight: 700,
                  }}
                >
                  Encerrar Evento e Emitir Certificados
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* Snack simples */}
      {snack && (
        <Box sx={{
          position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          bgcolor: '#0F172A', color: '#fff', px: 3, py: 1.5, borderRadius: 2,
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)', zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 300,
        }}>
          <CheckCircleIcon sx={{ color: ACCENT, fontSize: 20 }} />
          <Typography variant="body2">{snack}</Typography>
        </Box>
      )}
    </Box>
  );
}
