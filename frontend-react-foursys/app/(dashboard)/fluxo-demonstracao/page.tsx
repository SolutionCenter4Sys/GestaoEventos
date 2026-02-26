'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Chip,
  Divider,
  TextField,
  Select,
  MenuItem as MuiMenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material';

// MUI Icons
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ApprovalIcon from '@mui/icons-material/Approval';
import PublicIcon from '@mui/icons-material/Public';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import UploadIcon from '@mui/icons-material/Upload';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import DownloadIcon from '@mui/icons-material/Download';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BadgeIcon from '@mui/icons-material/Badge';
import CampaignIcon from '@mui/icons-material/Campaign';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SchoolIcon from '@mui/icons-material/School';
import InputIcon from '@mui/icons-material/Input';
import OutputIcon from '@mui/icons-material/Output';
import BuildIcon from '@mui/icons-material/Build';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import EventIcon from '@mui/icons-material/Event';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PeopleIcon from '@mui/icons-material/People';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import ScheduleIcon from '@mui/icons-material/Schedule';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';
import StarRateIcon from '@mui/icons-material/StarRate';
import SendIcon from '@mui/icons-material/Send';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RateReviewIcon from '@mui/icons-material/RateReview';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { mascaraCEP, buscarEnderecoPorCEP } from '@/shared/utils/validators';

// ─── Types ────────────────────────────────────────────────────────────────────

type StageStatus = 'pending' | 'active' | 'completed' | 'rejected';

interface Participante {
  nome: string;
  email: string;
  inscritoEm: string;
  presente: boolean;
  checkinEm?: string | null;
}

interface Documento {
  nome: string;
  status: 'pendente' | 'enviado' | 'aprovado';
  tipo: string;
}

interface FlowStage {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  role: string;
  roleIcon: React.ReactNode;
  status: StageStatus;
  description: string;
  input: string;
  output: string;
  tools: string[];
  route?: string;
  routeLabel?: string;
  actionLabel?: string;
  color: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BRAND_GRADIENT = 'linear-gradient(135deg, #9A1BFF 0%, #7B1CE5 40%, #4F46E5 100%)';
const ACCENT = '#18C964';
const ACCENT_DARK = '#16A34A';
const BLACK = '#000000';

const COLOR_MAP: Record<string, string> = {
  gold: '#7B1CE5',
  blue: '#2563EB',
  green: '#16A34A',
  purple: '#7B1FA2',
  orange: '#E65100',
  teal: '#00695C',
};

const STATUS_COLORS: Record<StageStatus, { bg: string; color: string; label: string }> = {
  pending: { bg: '#F1F5F9', color: '#64748B', label: 'Pendente' },
  active: { bg: '#FFF3CD', color: '#856404', label: 'Em andamento' },
  completed: { bg: '#E6FDF1', color: '#16A34A', label: 'Concluída' },
  rejected: { bg: '#FEE2E2', color: '#DC2626', label: 'Rejeitada' },
};

const DOC_STATUS: Record<string, { bg: string; color: string; label: string }> = {
  aprovado: { bg: '#E6FDF1', color: '#16A34A', label: 'Aprovado' },
  enviado: { bg: '#FFF3CD', color: '#856404', label: 'Enviado' },
  pendente: { bg: '#FEE2E2', color: '#DC2626', label: 'Pendente' },
};

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

const INITIAL_PARTICIPANTES: Participante[] = [
  { nome: 'Ana Paula Ferreira', email: 'ana.ferreira@email.com', inscritoEm: 'há 2 dias', presente: true, checkinEm: '22/03/2026 08:02' },
  { nome: 'Carlos Eduardo Lima', email: 'carlos.lima@email.com', inscritoEm: 'há 2 dias', presente: true, checkinEm: '22/03/2026 08:07' },
  { nome: 'Fernanda Costa', email: 'fernanda.costa@email.com', inscritoEm: 'há 1 dia', presente: false, checkinEm: null },
  { nome: 'João Victor Santos', email: 'joao.santos@email.com', inscritoEm: 'há 1 dia', presente: true, checkinEm: '22/03/2026 08:15' },
  { nome: 'Mariana Oliveira', email: 'mariana.oliveira@email.com', inscritoEm: 'há 5 horas', presente: false, checkinEm: null },
];

const INITIAL_DOCUMENTOS: Documento[] = [
  { nome: 'Anamnese da Paciente', status: 'aprovado', tipo: 'PDF · Formulário' },
  { nome: 'Termo de Consentimento (TCLE)', status: 'aprovado', tipo: 'PDF · Assinado' },
  { nome: 'Fotos Pré-Procedimento', status: 'enviado', tipo: 'Imagens · Galeria' },
  { nome: 'Ficha de Avaliação Estética', status: 'pendente', tipo: 'PDF · Formulário' },
  { nome: 'Protocolo do Procedimento', status: 'pendente', tipo: 'PDF · Documento' },
];

const NOMES_MOCK = ['Beatriz Mendes', 'Rafael Torres', 'Gabriela Rocha', 'Lucas Almeida', 'Priscila Nunes'];

function buildStages(statuses: StageStatus[]): FlowStage[] {
  return [
    {
      id: 1, title: 'Solicitação Interna', subtitle: 'Vendas preenche formulário inteligente',
      icon: <EditNoteIcon />, role: 'Vendedor', roleIcon: <BadgeIcon />,
      status: statuses[0],
      description: 'O vendedor preenche um formulário padronizado com validação obrigatória e campos condicionais (ex.: se presencial, requer endereço). A IA sugere campos com base em eventos similares.',
      input: 'Dados do vendedor e detalhes do evento',
      output: 'Solicitação salva no dashboard com status "Em Revisão"',
      tools: ['Formulário Inteligente com IA', 'Chat de Suporte Integrado', 'Validação em Tempo Real'],
      route: '/solicitar-evento', routeLabel: 'Abrir Formulário', actionLabel: 'Enviar para Revisão', color: 'gold',
    },
    {
      id: 2, title: 'Aprovação (Marketing)', subtitle: 'Revisão e aprovação com integração Outlook',
      icon: <ApprovalIcon />, role: 'Marketing', roleIcon: <CampaignIcon />,
      status: statuses[1],
      description: 'A equipe de Marketing recebe notificação push, revisa via dashboard com workflow visual e aprova ou reprova. Se aprovado, o evento é automaticamente agendado no Outlook Calendar.',
      input: 'Solicitação com status "Em Revisão"',
      output: 'Evento aprovado/publicado ou rejeitado com feedback',
      tools: ['Dashboard com Workflow Visual', 'Notificações Push', 'API Outlook Calendar', 'Histórico de Aprovações'],
      route: '/solicitacoes', routeLabel: 'Ver Fila de Aprovações', actionLabel: 'Aprovar Evento', color: 'blue',
    },
    {
      id: 3, title: 'Publicação e Inscrições', subtitle: 'Página publicada e inscrições automáticas',
      icon: <PublicIcon />, role: 'Sistema Automatizado', roleIcon: <SmartToyIcon />,
      status: statuses[2],
      description: 'Após a aprovação, o evento é publicado automaticamente gerando uma página de inscrição responsiva. Participantes se inscrevem e recebem confirmação imediata por e-mail. Lista atualizada em tempo real.',
      input: 'Evento aprovado pelo Marketing',
      output: 'Lista de inscritos atualizada em tempo real com confirmações automáticas',
      tools: ['Página de Inscrição Responsiva', 'E-mail de Confirmação Automático', 'Dashboard em Tempo Real', 'Lista de Espera'],
      route: '/eventos', routeLabel: 'Ver Eventos Publicados', actionLabel: 'Confirmar Inscrições', color: 'green',
    },
    {
      id: 4, title: 'Preparação Pré-Evento', subtitle: 'Professor insere paciente modelo e documentos',
      icon: <AssignmentIcon />, role: 'Professor & RT (Barbara)', roleIcon: <SchoolIcon />,
      status: statuses[3],
      description: 'O professor acessa o dashboard dedicado para incluir dados da paciente modelo e fazer upload de fotos. Documentos são enviados automaticamente por e-mail e rastreados com status em tempo real.',
      input: 'Lista de participantes e dados iniciais da paciente',
      output: 'Ficha completa da paciente com documentos rastreados',
      tools: ['Área do Professor Dedicada', 'Upload Seguro de Documentos', 'Rastreamento de Status', 'Envio Automático por E-mail'],
      route: '/documentos', routeLabel: 'Área do Professor', actionLabel: 'Completar Preparação', color: 'purple',
    },
  ];
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function MiniBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status as StageStatus] ?? { bg: '#F1F5F9', color: '#64748B', label: status };
  return (
    <Box component="span" sx={{
      display: 'inline-block', fontSize: '0.62rem', fontWeight: 700,
      px: 0.8, py: 0.25, borderRadius: '8px', bgcolor: s.bg, color: s.color, lineHeight: 1.4,
    }}>
      {s.label}
    </Box>
  );
}

function DocBadge({ status }: { status: string }) {
  const s = DOC_STATUS[status] ?? { bg: '#F1F5F9', color: '#64748B', label: status };
  return (
    <Box component="span" sx={{
      display: 'inline-block', fontSize: '0.65rem', fontWeight: 700,
      px: 0.8, py: 0.25, borderRadius: '8px', bgcolor: s.bg, color: s.color,
    }}>
      {s.label}
    </Box>
  );
}

function Snackbar({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [msg, onClose]);
  return (
    <Box sx={{
      position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)',
      bgcolor: '#0F172A', color: '#fff', px: 3, py: 1.5, borderRadius: 2,
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)', zIndex: 9999, fontSize: '0.875rem', fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 280,
    }}>
      <CheckCircleIcon sx={{ color: ACCENT, fontSize: 20 }} />
      {msg}
    </Box>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function FluxoDemonstracaoPage() {
  const initialStatuses: StageStatus[] = ['active', 'pending', 'pending', 'pending'];
  const [statuses, setStatuses] = useState<StageStatus[]>(initialStatuses);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [snackMsg, setSnackMsg] = useState('');
  const [participantes, setParticipantes] = useState<Participante[]>(INITIAL_PARTICIPANTES);
  const [documentos, setDocumentos] = useState<Documento[]>(INITIAL_DOCUMENTOS);
  const [formato, setFormato] = useState('Presencial');
  const [cepEvento, setCepEvento] = useState('01310-100');
  const [ruaEvento, setRuaEvento] = useState('Av. Paulista');
  const [bairroEvento, setBairroEvento] = useState('Bela Vista');
  const [cidadeEvento, setCidadeEvento] = useState('São Paulo/SP');
  const [numeroEvento, setNumeroEvento] = useState('1234');
  const [complementoEvento, setComplementoEvento] = useState('Clínica Alur Medical');
  const [buscandoCepEvento, setBuscandoCepEvento] = useState(false);
  const [conviteDialogOpen, setConviteDialogOpen] = useState(false);
  const [conviteEmail, setConviteEmail] = useState(true);
  const [conviteWhatsApp, setConviteWhatsApp] = useState(false);
  const [conviteEnviado, setConviteEnviado] = useState(false);
  const [templateAprovacao, setTemplateAprovacao] = useState('aprovacao_evento_padrao');
  const [templateCertificado, setTemplateCertificado] = useState('modelo_alur_padrao');
  const [pesquisaEnviada, setPesquisaEnviada] = useState(false);
  const [pesquisaRespondidaByEmail, setPesquisaRespondidaByEmail] = useState<Record<string, boolean>>({
    'ana.ferreira@email.com': true,
  });
  const [conviteArquivo, setConviteArquivo] = useState<File | null>(null);
  const [conviteDragOver, setConviteDragOver] = useState(false);
  const conviteInputRef = useRef<HTMLInputElement>(null);

  const stages = useMemo(() => buildStages(statuses), [statuses]);
  const selectedStage = useMemo(() => stages.find(s => s.id === selectedId) ?? null, [stages, selectedId]);

  const completedCount = useMemo(() => statuses.filter(s => s === 'completed').length, [statuses]);
  const progressValue = (completedCount / stages.length) * 100;

  const inscritosCount = participantes.length;
  const presentesCount = useMemo(() => participantes.filter(p => p.presente).length, [participantes]);
  const participantesPresentes = useMemo(() => participantes.filter(p => p.presente), [participantes]);
  const docCompletude = useMemo(() => {
    const aprovados = documentos.filter(d => d.status === 'aprovado').length;
    return Math.round((aprovados / documentos.length) * 100);
  }, [documentos]);

  const showEndereco = formato === 'Presencial' || formato === 'Híbrido';

  const notify = useCallback((msg: string) => setSnackMsg(msg), []);

  const advanceStageById = useCallback((id: number) => {
    setStatuses(prev => {
      const next = [...prev];
      next[id - 1] = 'completed';
      if (id < next.length && next[id] === 'pending') next[id] = 'active';
      return next;
    });
    setSelectedId(prev => Math.min(prev + 1, stages.length));
  }, [stages.length]);

  const resetDemo = useCallback(() => {
    setStatuses(['active', 'pending', 'pending', 'pending']);
    setParticipantes(INITIAL_PARTICIPANTES);
    setDocumentos(INITIAL_DOCUMENTOS);
    setCepEvento('01310-100');
    setRuaEvento('Av. Paulista');
    setBairroEvento('Bela Vista');
    setCidadeEvento('São Paulo/SP');
    setNumeroEvento('1234');
    setComplementoEvento('Clínica Alur Medical');
    setTemplateCertificado('modelo_alur_padrao');
    setPesquisaEnviada(false);
    setPesquisaRespondidaByEmail({ 'ana.ferreira@email.com': true });
    setSelectedId(1);
  }, []);

  const preencherEnderecoEventoPorCep = async (cep: string) => {
    const cepNumerico = cep.replace(/\D/g, '');
    if (cepNumerico.length !== 8) return;
    setBuscandoCepEvento(true);
    try {
      const endereco = await buscarEnderecoPorCEP(cepNumerico);
      if (!endereco) {
        notify('CEP não encontrado.');
        return;
      }
      setRuaEvento(endereco.rua);
      setBairroEvento(endereco.bairro);
      setCidadeEvento(endereco.cidade);
      if (!complementoEvento) setComplementoEvento(endereco.complemento);
      notify('Endereço preenchido automaticamente pelo CEP.');
    } finally {
      setBuscandoCepEvento(false);
    }
  };

  const addParticipante = () => {
    const idx = participantes.length % NOMES_MOCK.length;
    const nome = NOMES_MOCK[idx];
    setParticipantes(prev => [...prev, { nome, email: `${nome.toLowerCase().replace(/ /g, '.')}@email.com`, inscritoEm: 'agora mesmo', presente: false }]);
    notify(`${nome} inscrito(a)! Confirmação enviada por e-mail.`);
  };

  const uploadDoc = (doc: Documento) => {
    setDocumentos(prev => prev.map(d => d.nome === doc.nome ? { ...d, status: 'enviado' as const } : d));
    notify(`"${doc.nome}" enviado com sucesso!`);
  };

  const submitStage1 = () => { advanceStageById(1); notify('Solicitação enviada para revisão do Marketing!'); };
  const approveStage2 = () => { advanceStageById(2); notify('Evento aprovado! Publicado + agendado no Outlook automaticamente.'); };
  const rejectStage2 = () => {
    setStatuses(prev => { const n = [...prev]; n[1] = 'rejected'; return n; });
    notify('Solicitação reprovada. Feedback enviado ao vendedor.');
  };

  const handleSelecionarTemplateCertificado = (value: string) => {
    setTemplateCertificado(value);
    setPesquisaEnviada(true);
    notify('Template selecionado. Pesquisa de satisfação enviada automaticamente por e-mail.');
  };

  const marcarPesquisaRespondida = (email: string, nome: string) => {
    setPesquisaRespondidaByEmail(prev => ({ ...prev, [email]: true }));
    notify(`Pesquisa de satisfação respondida por ${nome}. Download do certificado habilitado.`);
  };

  // ─── Render helpers ────────────────────────────────────────────────────────

  const cardSx = {
    borderRadius: 3, boxShadow: '0 10px 25px rgba(15,23,42,0.06)',
    border: '1px solid #EEF2FF', mb: 2,
  };

  const sectionTitle = (icon: React.ReactNode, label: string) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
      <Box sx={{ color: '#64748B', display: 'flex' }}>{icon}</Box>
      <Typography variant="subtitle2" fontWeight={700}>{label}</Typography>
    </Box>
  );

  const demoActionRow = (children: React.ReactNode) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mt: 2, pt: 2, borderTop: '1px solid #EEF2FF' }}>
      {children}
    </Box>
  );

  // ─── Stage demo panels ─────────────────────────────────────────────────────

  const renderStage1 = () => (
    <Card sx={cardSx}>
      <CardHeader
        avatar={<Box sx={{ bgcolor: '#F3E5F5', borderRadius: '50%', p: 0.5, display: 'flex' }}><AutoAwesomeIcon sx={{ color: '#7B1FA2' }} /></Box>}
        title="Formulário Inteligente de Solicitação"
        subheader="IA sugere campos com base em eventos similares"
        titleTypographyProps={{ fontWeight: 700, fontSize: '1rem' }}
      />
      <CardContent>
        {/* AI Banner */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, bgcolor: '#F3E5F5', border: '1px solid #CE93D8', borderRadius: 2, p: 1.5, mb: 2 }}>
          <AutoAwesomeIcon sx={{ color: '#7B1FA2', flexShrink: 0, mt: 0.2 }} />
          <Typography variant="body2">
            <Box component="strong" sx={{ color: '#7B1FA2' }}>Sugestão da IA:</Box>{' '}
            Com base em eventos similares, recomendo {MOCK_EVENTO.vagas} vagas e formato presencial com sala reservada no local indicado.
          </Typography>
        </Box>

        {/* Form */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField label="Nome do Evento" size="small" defaultValue={MOCK_EVENTO.nome} fullWidth />
            <FormControl size="small" fullWidth>
              <InputLabel>Tipo de Evento</InputLabel>
              <Select label="Tipo de Evento" defaultValue="Workshop">
                <MuiMenuItem value="Workshop">Workshop Clínico</MuiMenuItem>
                <MuiMenuItem value="Mentoria">Mentoria</MuiMenuItem>
                <MuiMenuItem value="Treinamento">Treinamento</MuiMenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Formato</InputLabel>
              <Select label="Formato" value={formato} onChange={e => setFormato(e.target.value)}>
                <MuiMenuItem value="Presencial">Presencial</MuiMenuItem>
                <MuiMenuItem value="Online">Online</MuiMenuItem>
                <MuiMenuItem value="Híbrido">Híbrido</MuiMenuItem>
              </Select>
            </FormControl>
            <TextField label="Vagas" size="small" type="number" defaultValue={MOCK_EVENTO.vagas} fullWidth />
          </Box>
          {showEndereco && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                label="CEP *"
                size="small"
                value={cepEvento}
                onChange={e => setCepEvento(mascaraCEP(e.target.value))}
                onBlur={e => { void preencherEnderecoEventoPorCep(e.target.value); }}
                helperText={buscandoCepEvento ? 'Buscando endereço pelo CEP...' : 'Ao preencher o CEP os demais campos serão preenchidos automaticamente.'}
                fullWidth
              />
              <TextField label="Rua *" size="small" value={ruaEvento} onChange={e => setRuaEvento(e.target.value)} fullWidth />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <TextField label="Número *" size="small" value={numeroEvento} onChange={e => setNumeroEvento(e.target.value)} fullWidth />
                <TextField label="Complemento" size="small" value={complementoEvento} onChange={e => setComplementoEvento(e.target.value)} fullWidth />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <TextField label="Bairro *" size="small" value={bairroEvento} onChange={e => setBairroEvento(e.target.value)} fullWidth />
                <TextField label="Cidade *" size="small" value={cidadeEvento} onChange={e => setCidadeEvento(e.target.value)} fullWidth />
              </Box>
            </Box>
          )}
          <TextField label="Professor Responsável" size="small" defaultValue={MOCK_EVENTO.professor} fullWidth />
        </Box>

        {/* Chat support */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#EFF6FF', borderRadius: 2, p: 1.5, mt: 1.5 }}>
          <SupportAgentIcon sx={{ color: '#2563EB' }} />
          <Typography variant="body2">
            <Box component="strong">Suporte ao Vendedor:</Box> Precisa de ajuda?{' '}
            <Box component="span" sx={{ color: ACCENT_DARK, fontWeight: 600, cursor: 'pointer' }}>Abrir Chat</Box>
          </Typography>
        </Box>

        {demoActionRow(<>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#64748B', fontSize: '0.875rem' }}>
            <ScheduleIcon sx={{ fontSize: 18 }} /> Status: <Box component="strong">Rascunho</Box>
          </Box>
          <Button variant="contained" sx={{ bgcolor: BLACK, borderRadius: 9999 }} onClick={submitStage1}
            startIcon={<ArrowForwardIcon />}>Enviar para Revisão</Button>
        </>)}
      </CardContent>
    </Card>
  );

  const renderStage2 = () => (
    <Card sx={cardSx}>
      <CardHeader
        avatar={<Box sx={{ bgcolor: '#DBEAFE', borderRadius: '50%', p: 0.5, display: 'flex' }}><ApprovalIcon sx={{ color: '#2563EB' }} /></Box>}
        title="Dashboard de Aprovação — Marketing"
        subheader="Notificação recebida · Revisão em andamento"
        titleTypographyProps={{ fontWeight: 700, fontSize: '1rem' }}
      />
      <CardContent>
        {/* Notification */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, bgcolor: '#FFF3CD', border: '1px solid #FFC107', borderRadius: 2, p: 1.5, mb: 2 }}>
          <NotificationsActiveIcon sx={{ color: '#856404', flexShrink: 0 }} />
          <Typography variant="body2">
            <Box component="strong">Nova solicitação recebida:</Box> &ldquo;{MOCK_EVENTO.nome}&rdquo; aguarda sua aprovação.
            <Box component="span" sx={{ ml: 1, fontSize: '0.75rem', color: '#64748B' }}>há 2 minutos</Box>
          </Typography>
        </Box>

        {/* Summary grid */}
        <Typography variant="subtitle2" fontWeight={700} mb={1}>Resumo da Solicitação</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
          {[
            { icon: <EventIcon fontSize="small" />, label: 'Evento', value: MOCK_EVENTO.nome },
            { icon: <CategoryIcon fontSize="small" />, label: 'Tipo', value: MOCK_EVENTO.tipo },
            { icon: <LocationOnIcon fontSize="small" />, label: 'Formato', value: MOCK_EVENTO.formato },
            { icon: <GroupIcon fontSize="small" />, label: 'Vagas', value: String(MOCK_EVENTO.vagas) },
            { icon: <SchoolIcon fontSize="small" />, label: 'Professor', value: MOCK_EVENTO.professor },
            { icon: <LocationOnIcon fontSize="small" />, label: 'Local', value: MOCK_EVENTO.local },
          ].map(item => (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, bgcolor: '#F9FAFB', borderRadius: 1.5, p: 1 }}>
              <Box sx={{ color: ACCENT_DARK, flexShrink: 0, mt: 0.1 }}>{item.icon}</Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>{item.label}</Typography>
                <Typography variant="body2" fontWeight={600}>{item.value}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Workflow visual */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center', bgcolor: '#F9FAFB', borderRadius: 2, p: 1.5, mb: 2, flexWrap: 'wrap' }}>
          {[
            { icon: <CheckCircleIcon />, label: 'Recebido', done: true },
            null,
            { icon: <RateReviewIcon />, label: 'Em Revisão', active: true },
            null,
            { icon: <CheckCircleIcon />, label: 'Aprovado', done: false },
            null,
            { icon: <CalendarTodayIcon />, label: 'Outlook', done: false },
          ].map((item, i) => item === null
            ? <ArrowForwardIcon key={i} sx={{ color: '#CBD5E1', fontSize: 18 }} />
            : (
              <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
                <Box sx={{ color: (item as any).done ? ACCENT_DARK : (item as any).active ? '#F59E0B' : '#CBD5E1' }}>{item.icon}</Box>
                <Typography variant="caption" fontWeight={600}>{item.label}</Typography>
              </Box>
            )
          )}
        </Box>

        {/* Outlook banner */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, bgcolor: '#E3F2FD', border: '1px solid #90CAF9', borderRadius: 2, p: 1.5, mb: 2 }}>
          <EventAvailableIcon sx={{ color: '#1565C0', flexShrink: 0 }} />
          <Typography variant="body2"><Box component="strong">Integração Outlook:</Box> Ao aprovar, o evento será criado automaticamente no Outlook Calendar de todos os envolvidos.</Typography>
        </Box>

        <TextField label="Feedback / Observações" multiline rows={2} fullWidth size="small"
          placeholder="Adicione comentários para o solicitante..." sx={{ mb: 1.5 }} />

        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 320 }}>
            <InputLabel>Template de e-mail</InputLabel>
            <Select
              label="Template de e-mail"
              value={templateAprovacao}
              onChange={e => {
                setTemplateAprovacao(e.target.value);
                notify(`Template selecionado: ${e.target.value.replace(/_/g, ' ')}`);
              }}
              startAdornment={<EmailIcon sx={{ color: '#64748B', mr: 1, fontSize: 18 }} />}
            >
              <MuiMenuItem value="aprovacao_evento_padrao">Aprovação de Evento — Padrão</MuiMenuItem>
              <MuiMenuItem value="aprovacao_evento_marketing">Aprovação de Evento — Marketing</MuiMenuItem>
              <MuiMenuItem value="aprovacao_evento_executivo">Aprovação de Evento — Executivo</MuiMenuItem>
            </Select>
          </FormControl>

          {/* Botões de aprovação */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="outlined" color="error" startIcon={<CancelIcon />} sx={{ borderRadius: 9999 }} onClick={rejectStage2}>Reprovar</Button>
            <Button variant="contained" sx={{ bgcolor: ACCENT_DARK, borderRadius: 9999, '&:hover': { bgcolor: '#15803D' } }}
              startIcon={<CheckCircleIcon />} onClick={approveStage2}>Aprovar e Publicar</Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderStage3 = () => (
    <Card sx={cardSx}>
      <CardHeader
        avatar={<Box sx={{ bgcolor: '#E6FDF1', borderRadius: '50%', p: 0.5, display: 'flex' }}><PublicIcon sx={{ color: ACCENT_DARK }} /></Box>}
        title="Página de Inscrição — Publicada Automaticamente"
        subheader={`${inscritosCount} participantes inscritos em tempo real`}
        titleTypographyProps={{ fontWeight: 700, fontSize: '1rem' }}
      />
      <CardContent>
        {/* Status banner */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: '#E6FDF1', color: ACCENT_DARK, borderRadius: 9999, px: 2, py: 0.75, fontWeight: 700, fontSize: '0.85rem' }}>
            <PublicIcon fontSize="small" /> EVENTO PUBLICADO
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {[
              { value: inscritosCount, label: 'Inscritos' },
              { value: MOCK_EVENTO.vagas - inscritosCount, label: 'Vagas restantes' },
              { value: `${Math.round((inscritosCount / MOCK_EVENTO.vagas) * 100)}%`, label: 'Ocupação' },
            ].map(s => (
              <Box key={s.label} textAlign="center">
                <Typography fontWeight={700} fontSize="1.4rem" color="primary" sx={{ color: '#7B1CE5' }}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <LinearProgress variant="determinate" value={(inscritosCount / MOCK_EVENTO.vagas) * 100}
          sx={{ mb: 2, borderRadius: 2, height: 8, bgcolor: '#E6FDF1', '& .MuiLinearProgress-bar': { bgcolor: ACCENT_DARK } }} />

        {sectionTitle(<PeopleIcon fontSize="small" />, 'Participantes Inscritos')}
        <Box>
          {participantes.map(p => (
            <Box key={p.email} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, borderBottom: '1px solid #F1F5F9' }}>
              <Avatar sx={{ bgcolor: '#7B1CE5', width: 34, height: 34, fontSize: '0.85rem', fontWeight: 700 }}>{p.nome[0]}</Avatar>
              <Box flex={1} minWidth={0}>
                <Typography variant="body2" fontWeight={600}>{p.nome}</Typography>
                <Typography variant="caption" color="text.secondary">{p.email}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">{p.inscritoEm}</Typography>
              <CheckCircleIcon sx={{ color: ACCENT_DARK, fontSize: 20 }} />
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<PersonAddIcon />} sx={{ borderRadius: 9999 }} onClick={addParticipante}>
            Simular Nova Inscrição
          </Button>
          <Typography variant="caption" color="text.secondary">Confirmação automática por e-mail ao inscrever</Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Botão Exportar Convites em Massa */}
        <Box sx={{ py: 1 }}>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={() => { setConviteEnviado(false); setConviteArquivo(null); setConviteDialogOpen(true); }}
            sx={{
              borderRadius: 9999,
              background: 'linear-gradient(135deg, #9A1BFF 0%, #4F46E5 100%)',
              color: '#fff',
              fontWeight: 700,
              px: 3,
              boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #8B10F0 0%, #4338CA 100%)',
                boxShadow: '0 6px 20px rgba(79,70,229,0.45)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Exportar Convites em Massa
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75, ml: 0.5 }}>
            Dispare convites para todos os {inscritosCount} participantes inscritos
          </Typography>
        </Box>

        {/* Dialog de canais de disparo */}
        <Dialog
          open={conviteDialogOpen}
          onClose={() => setConviteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 40, height: 40, borderRadius: 2,
                background: 'linear-gradient(135deg, #9A1BFF 0%, #4F46E5 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <SendIcon sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography fontWeight={700} fontSize="1rem" lineHeight={1.2}>Disparar Convites</Typography>
                <Typography variant="caption" color="text.secondary">Selecione os canais de envio</Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setConviteDialogOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ pt: 1 }}>
            {conviteEnviado ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
                <Alert severity="success" icon={<MarkEmailReadIcon />} sx={{ borderRadius: 2 }}>
                  <Typography fontWeight={700} fontSize="0.9rem">Convites disparados com sucesso!</Typography>
                  <Typography variant="caption">
                    {[conviteEmail && 'E-mail', conviteWhatsApp && 'WhatsApp'].filter(Boolean).join(' e ')} enviados para{' '}
                    <strong>{conviteArquivo ? `destinatários do arquivo "${conviteArquivo.name}"` : `${inscritosCount} participantes inscritos`}</strong>.
                  </Typography>
                </Alert>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {conviteEmail && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.82rem', color: '#4F46E5' }}>
                      <MarkEmailReadIcon sx={{ fontSize: 16 }} /> E-mails em fila de envio — rastreamento ativo
                    </Box>
                  )}
                  {conviteWhatsApp && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.82rem', color: '#25D366' }}>
                      <WhatsAppIcon sx={{ fontSize: 16 }} /> Mensagens WhatsApp agendadas via API Business
                    </Box>
                  )}
                </Box>
              </Box>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Escolha um ou mais canais para enviar os convites a todos os <strong>{inscritosCount} participantes</strong> inscritos no evento.
                </Typography>

                {/* ── Área de Upload de Arquivo ── */}
                <input
                  ref={conviteInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files?.[0] ?? null;
                    setConviteArquivo(file);
                    if (e.target) e.target.value = '';
                  }}
                />

                {conviteArquivo ? (
                  /* Arquivo selecionado */
                  <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    border: '2px solid #4F46E5', borderRadius: 3,
                    bgcolor: '#EEF2FF', p: 1.5, mb: 2,
                  }}>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: 2, flexShrink: 0,
                      bgcolor: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <InsertDriveFileIcon sx={{ color: '#fff', fontSize: 20 }} />
                    </Box>
                    <Box flex={1} minWidth={0}>
                      <Typography fontWeight={700} fontSize="0.85rem" noWrap>{conviteArquivo.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(conviteArquivo.size / 1024).toFixed(1)} KB · Arquivo pronto para envio
                      </Typography>
                    </Box>
                    <Tooltip title="Remover arquivo">
                      <IconButton
                        size="small"
                        onClick={() => setConviteArquivo(null)}
                        sx={{ color: '#DC2626', '&:hover': { bgcolor: '#FEE2E2' } }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ) : (
                  /* Zona de drop — wrapper relativo para posicionar o botão de download */
                  <Box sx={{ position: 'relative', mb: 2 }}>

                    {/* Botão download template — canto superior direito */}
                    <Tooltip title="Baixar template CSV" placement="top" arrow>
                      <IconButton
                        size="small"
                        onClick={e => {
                          e.stopPropagation();
                          const csv = 'nome,email,telefone\nJoão Silva,joao@email.com,11999990000\nMaria Souza,maria@email.com,11988880000';
                          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'template_convites.csv';
                          a.click();
                          URL.revokeObjectURL(url);
                          notify('Template baixado com sucesso!');
                        }}
                        sx={{
                          position: 'absolute', top: 8, right: 8, zIndex: 1,
                          width: 30, height: 30,
                          bgcolor: '#fff',
                          border: '1px solid #E2E8F0',
                          boxShadow: '0 2px 6px rgba(15,23,42,0.08)',
                          color: '#4F46E5',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: '#EEF2FF',
                            borderColor: '#4F46E5',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 10px rgba(79,70,229,0.2)',
                          },
                        }}
                      >
                        <FileDownloadIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>

                    {/* Zona de drop */}
                    <Box
                      onClick={() => conviteInputRef.current?.click()}
                      onDragOver={e => { e.preventDefault(); setConviteDragOver(true); }}
                      onDragLeave={() => setConviteDragOver(false)}
                      onDrop={e => {
                        e.preventDefault();
                        setConviteDragOver(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file && /\.(csv|xlsx|xls)$/i.test(file.name)) {
                          setConviteArquivo(file);
                        } else if (file) {
                          notify('Formato inválido. Use CSV, XLSX ou XLS.');
                        }
                      }}
                      sx={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', gap: 0.75, cursor: 'pointer',
                        border: `2px dashed ${conviteDragOver ? '#4F46E5' : '#CBD5E1'}`,
                        borderRadius: 3, p: 2.5,
                        bgcolor: conviteDragOver ? '#EEF2FF' : '#F8FAFC',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: '#4F46E5', bgcolor: '#EEF2FF' },
                      }}
                    >
                      <Box sx={{
                        width: 44, height: 44, borderRadius: 2,
                        bgcolor: conviteDragOver ? '#4F46E5' : '#E2E8F0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}>
                        <UploadFileIcon sx={{ color: conviteDragOver ? '#fff' : '#64748B', fontSize: 24 }} />
                      </Box>
                      <Typography fontWeight={600} fontSize="0.85rem" color={conviteDragOver ? '#4F46E5' : 'text.primary'}>
                        {conviteDragOver ? 'Solte o arquivo aqui' : 'Arraste o arquivo ou clique para selecionar'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Formatos aceitos: <strong>CSV</strong>, <strong>XLSX</strong>, <strong>XLS</strong> · Máx. 5 MB
                      </Typography>
                      <Chip
                        label="Opcional — usa lista de inscritos se não enviado"
                        size="small"
                        sx={{ fontSize: '0.65rem', bgcolor: '#F1F5F9', color: '#64748B', mt: 0.25 }}
                      />
                    </Box>
                  </Box>
                )}

                <Divider sx={{ mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>CANAIS DE ENVIO</Typography>
                </Divider>

                <FormGroup sx={{ gap: 1 }}>
                  {/* E-mail */}
                  <Box
                    onClick={() => setConviteEmail(v => !v)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 2,
                      border: `2px solid ${conviteEmail ? '#4F46E5' : '#E2E8F0'}`,
                      borderRadius: 3, p: 1.5, cursor: 'pointer',
                      bgcolor: conviteEmail ? '#EEF2FF' : '#fff',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: '#4F46E5', bgcolor: '#EEF2FF' },
                    }}
                  >
                    <Box sx={{
                      width: 42, height: 42, borderRadius: 2, flexShrink: 0,
                      bgcolor: conviteEmail ? '#4F46E5' : '#F1F5F9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <MarkEmailReadIcon sx={{ color: conviteEmail ? '#fff' : '#94A3B8', fontSize: 22 }} />
                    </Box>
                    <Box flex={1}>
                      <Typography fontWeight={700} fontSize="0.9rem">E-mail</Typography>
                      <Typography variant="caption" color="text.secondary">Envio com template personalizado e rastreamento de abertura</Typography>
                    </Box>
                    <Checkbox
                      checked={conviteEmail}
                      onChange={e => setConviteEmail(e.target.checked)}
                      onClick={e => e.stopPropagation()}
                      sx={{ color: '#4F46E5', '&.Mui-checked': { color: '#4F46E5' } }}
                    />
                  </Box>

                  {/* WhatsApp */}
                  <Box
                    onClick={() => setConviteWhatsApp(v => !v)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 2,
                      border: `2px solid ${conviteWhatsApp ? '#25D366' : '#E2E8F0'}`,
                      borderRadius: 3, p: 1.5, cursor: 'pointer',
                      bgcolor: conviteWhatsApp ? '#F0FFF6' : '#fff',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: '#25D366', bgcolor: '#F0FFF6' },
                    }}
                  >
                    <Box sx={{
                      width: 42, height: 42, borderRadius: 2, flexShrink: 0,
                      bgcolor: conviteWhatsApp ? '#25D366' : '#F1F5F9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <WhatsAppIcon sx={{ color: conviteWhatsApp ? '#fff' : '#94A3B8', fontSize: 22 }} />
                    </Box>
                    <Box flex={1}>
                      <Typography fontWeight={700} fontSize="0.9rem">WhatsApp</Typography>
                      <Typography variant="caption" color="text.secondary">Mensagem via API WhatsApp Business com link de inscrição</Typography>
                    </Box>
                    <Checkbox
                      checked={conviteWhatsApp}
                      onChange={e => setConviteWhatsApp(e.target.checked)}
                      onClick={e => e.stopPropagation()}
                      sx={{ color: '#25D366', '&.Mui-checked': { color: '#25D366' } }}
                    />
                  </Box>
                </FormGroup>

                {!conviteEmail && !conviteWhatsApp && (
                  <Alert severity="warning" sx={{ borderRadius: 2, mt: 2 }}>
                    Selecione ao menos um canal para disparar os convites.
                  </Alert>
                )}
              </>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
            {conviteEnviado ? (
              <Button fullWidth variant="outlined" onClick={() => setConviteDialogOpen(false)} sx={{ borderRadius: 9999 }}>
                Fechar
              </Button>
            ) : (
              <>
                <Button variant="outlined" onClick={() => setConviteDialogOpen(false)} sx={{ borderRadius: 9999, flex: 1 }}>
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  disabled={!conviteEmail && !conviteWhatsApp}
                  onClick={() => {
                    setConviteEnviado(true);
                    const canais = [conviteEmail && 'E-mail', conviteWhatsApp && 'WhatsApp'].filter(Boolean).join(' e ');
                    notify(`Convites disparados via ${canais} para ${inscritosCount} participantes!`);
                  }}
                  startIcon={<SendIcon />}
                  sx={{
                    borderRadius: 9999, flex: 1,
                    background: 'linear-gradient(135deg, #9A1BFF 0%, #4F46E5 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, #8B10F0 0%, #4338CA 100%)' },
                    '&.Mui-disabled': { opacity: 0.4 },
                  }}
                >
                  Disparar Agora
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>

        {demoActionRow(
          <Link href={`/inscricao/${MOCK_EVENTO.id}`} passHref style={{ textDecoration: 'none' }}>
            <Button variant="outlined" startIcon={<OpenInNewIcon />} sx={{ borderRadius: 9999 }}>Ver Página de Inscrição Pública</Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );

  const renderStage4 = () => (
    <Card sx={cardSx}>
      <CardHeader
        avatar={<Box sx={{ bgcolor: '#F3E5F5', borderRadius: '50%', p: 0.5, display: 'flex' }}><AssignmentIcon sx={{ color: '#7B1FA2' }} /></Box>}
        title="Área do Professor — Preparação Pré-Evento"
        subheader="Gestão de paciente modelo e documentos"
        titleTypographyProps={{ fontWeight: 700, fontSize: '1rem' }}
      />
      <CardContent>
        {sectionTitle(<PersonPinIcon fontSize="small" />, 'Paciente Modelo')}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#F9FAFB', borderRadius: 2, p: 1.5, mb: 2, flexWrap: 'wrap' }}>
          <Avatar sx={{ bgcolor: '#7B1CE5', width: 48, height: 48, fontSize: '1.1rem', fontWeight: 700 }}>M</Avatar>
          <Box flex={1}>
            <Typography fontWeight={700}>Maria Clara Souza</Typography>
            <Typography variant="caption" color="text.secondary" display="block">42 anos · Harmonização Facial</Typography>
            <Typography variant="caption" color="text.secondary">Incluída por: Prof. {MOCK_EVENTO.professor}</Typography>
          </Box>
          <Chip label="Cadastrada" size="small" sx={{ bgcolor: '#E6FDF1', color: ACCENT_DARK, fontWeight: 700 }} />
        </Box>

        <Divider sx={{ my: 2 }} />
        {sectionTitle(<FolderSharedIcon fontSize="small" />, 'Documentos & Rastreamento')}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {documentos.map(doc => (
            <Box key={doc.nome} sx={{
              display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, borderRadius: 1.5, bgcolor: '#F9FAFB',
              borderLeft: `4px solid ${doc.status === 'aprovado' ? ACCENT_DARK : doc.status === 'enviado' ? '#F59E0B' : '#DC2626'}`,
            }}>
              {doc.status === 'aprovado'
                ? <CheckCircleIcon sx={{ color: ACCENT_DARK, fontSize: 20 }} />
                : doc.status === 'enviado'
                  ? <ScheduleIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
                  : <UploadFileIcon sx={{ color: '#DC2626', fontSize: 20 }} />}
              <Box flex={1} minWidth={0}>
                <Typography variant="body2" fontWeight={600}>{doc.nome}</Typography>
                <Typography variant="caption" color="text.secondary">{doc.tipo}</Typography>
              </Box>
              <DocBadge status={doc.status} />
              {doc.status === 'pendente' && (
                <Tooltip title="Fazer upload">
                  <IconButton size="small" onClick={() => uploadDoc(doc)}><UploadIcon fontSize="small" /></IconButton>
                </Tooltip>
              )}
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" fontWeight={700} mb={0.75}>Completude dos Documentos — {docCompletude}%</Typography>
        <LinearProgress variant="determinate" value={docCompletude}
          sx={{ borderRadius: 2, height: 8, bgcolor: '#E6FDF1', '& .MuiLinearProgress-bar': { bgcolor: ACCENT_DARK } }} />

        {demoActionRow(<>
          <Link href="/documentos" passHref style={{ textDecoration: 'none' }}>
            <Button variant="outlined" startIcon={<OpenInNewIcon />} sx={{ borderRadius: 9999 }}>Área do Professor</Button>
          </Link>
        </>)}
      </CardContent>
    </Card>
  );

  const renderStage5 = () => (
    <Card sx={cardSx}>
      <CardHeader
        avatar={<Box sx={{ bgcolor: '#FFF3E0', borderRadius: '50%', p: 0.5, display: 'flex' }}><HowToRegIcon sx={{ color: '#E65100' }} /></Box>}
        title="Check-in — Execução do Evento"
        subheader="App mobile para registro de presença em tempo real"
        titleTypographyProps={{ fontWeight: 700, fontSize: '1rem' }}
      />
      <CardContent>
        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
          {[
            { icon: <GroupIcon />, label: 'Inscritos', value: inscritosCount, color: '#64748B', bg: '#F1F5F9' },
            { icon: <HowToRegIcon />, label: 'Presentes', value: presentesCount, color: ACCENT_DARK, bg: '#E6FDF1' },
            { icon: <PersonOffIcon />, label: 'Ausentes', value: inscritosCount - presentesCount, color: '#DC2626', bg: '#FEE2E2' },
          ].map(s => (
            <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 90, bgcolor: s.bg, borderRadius: 2, px: 2, py: 1.5 }}>
              <Box sx={{ color: s.color }}>{s.icon}</Box>
              <Box>
                <Typography fontWeight={700} fontSize="1.3rem">{s.value}</Typography>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <LinearProgress variant="determinate" value={inscritosCount > 0 ? (presentesCount / inscritosCount) * 100 : 0}
          sx={{ mb: 2, borderRadius: 2, height: 8, bgcolor: '#E6FDF1', '& .MuiLinearProgress-bar': { bgcolor: ACCENT_DARK } }} />

        {sectionTitle(<ChecklistIcon fontSize="small" />, 'Registro de Presença')}
        <Box>
          {participantes.map(p => (
            <Box key={p.email} sx={{
              display: 'flex', alignItems: 'center', gap: 1.5, py: 1, borderRadius: 1.5,
              borderBottom: '1px solid #F1F5F9', bgcolor: p.presente ? '#E6FDF1' : 'transparent', px: p.presente ? 1 : 0, mb: 0.5,
            }}>
              <Avatar sx={{ bgcolor: p.presente ? ACCENT_DARK : '#7B1CE5', width: 34, height: 34, fontSize: '0.85rem', fontWeight: 700 }}>
                {p.nome[0]}
              </Avatar>
              <Box flex={1} minWidth={0}>
                <Typography variant="body2" fontWeight={600}>{p.nome}</Typography>
                <Typography variant="caption" color="text.secondary">{p.email}</Typography>
              </Box>
              {p.presente ? (
                <Box sx={{ textAlign: 'right' }}>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Check-in realizado"
                    size="small"
                    sx={{ bgcolor: '#E6FDF1', color: ACCENT_DARK, fontWeight: 700 }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                    {p.checkinEm ?? '22/03/2026 08:00'}
                  </Typography>
                </Box>
              ) : (
                <Chip
                  label="Check-in pendente"
                  size="small"
                  sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 700 }}
                />
              )}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  const renderStage6 = () => (
    <Card sx={cardSx}>
      <CardHeader
        avatar={<Box sx={{ bgcolor: '#E0F2F1', borderRadius: '50%', p: 0.5, display: 'flex' }}><EmojiEventsIcon sx={{ color: '#00695C' }} /></Box>}
        title="Certificação Automática — Pós-Evento"
        subheader="Certificados emitidos e enviados automaticamente por e-mail"
        titleTypographyProps={{ fontWeight: 700, fontSize: '1rem' }}
      />
      <CardContent>
        {sectionTitle(<WorkspacePremiumIcon fontSize="small" />, 'Modelo de Certificado')}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr auto' }, gap: 1.5, alignItems: 'center', mb: 2 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Selecionar modelo</InputLabel>
            <Select
              label="Selecionar modelo"
              value={templateCertificado}
              onChange={e => handleSelecionarTemplateCertificado(e.target.value)}
            >
              <MuiMenuItem value="modelo_alur_padrao">Modelo Alur Padrão</MuiMenuItem>
              <MuiMenuItem value="modelo_workshop_clinico">Modelo Workshop Clínico</MuiMenuItem>
              <MuiMenuItem value="modelo_certificacao_premium">Modelo Certificação Premium</MuiMenuItem>
            </Select>
          </FormControl>
          <Chip
            label={pesquisaEnviada ? 'Pesquisa enviada automaticamente' : 'Aguardando seleção do modelo'}
            size="small"
            sx={{
              bgcolor: pesquisaEnviada ? '#E6FDF1' : '#FFF3CD',
              color: pesquisaEnviada ? ACCENT_DARK : '#856404',
              fontWeight: 700,
            }}
          />
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
          {[
            { icon: <HowToRegIcon />, label: 'Participaram', value: presentesCount, bg: '#E6FDF1', color: ACCENT_DARK },
            { icon: <EmojiEventsIcon />, label: 'Certificados', value: participantesPresentes.length, bg: '#E0F2F1', color: '#00695C' },
            { icon: <EmailIcon />, label: 'E-mails enviados', value: participantesPresentes.length, bg: '#FFF3E0', color: '#E65100' },
          ].map(s => (
            <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 90, bgcolor: s.bg, borderRadius: 2, px: 2, py: 1.5 }}>
              <Box sx={{ color: s.color }}>{s.icon}</Box>
              <Box>
                <Typography fontWeight={700} fontSize="1.3rem">{s.value}</Typography>
                <Typography variant="caption">{s.label}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {sectionTitle(<VerifiedIcon fontSize="small" />, 'Certificados Emitidos')}
        {participantesPresentes.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, bgcolor: '#EFF6FF', borderRadius: 2, p: 1.5 }}>
            <InfoIcon sx={{ color: '#2563EB', fontSize: 20, flexShrink: 0 }} />
            <Typography variant="body2" color="text.secondary">
              Realize o check-in na Etapa 5 para habilitar a emissão de certificados
            </Typography>
          </Box>
        ) : (
          <Box>
            {participantesPresentes.map(p => (
              <Box key={p.email} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#F9FAFB', borderRadius: 1.5, p: 1.5, mb: 1 }}>
                <WorkspacePremiumIcon sx={{ color: '#7B1CE5', fontSize: 28, flexShrink: 0 }} />
                <Box flex={1} minWidth={0}>
                  <Typography variant="body2" fontWeight={700}>{p.nome}</Typography>
                  <Typography variant="caption" color="text.secondary">{MOCK_EVENTO.nome} · {MOCK_EVENTO.data}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.4 }}>
                  <Chip label="Certificado enviado por e-mail" size="small" sx={{ bgcolor: '#E6FDF1', color: ACCENT_DARK, fontWeight: 600 }} />
                  <Chip
                    label={pesquisaRespondidaByEmail[p.email] ? 'Pesquisa respondida' : pesquisaEnviada ? 'Pesquisa enviada' : 'Pesquisa pendente'}
                    size="small"
                    sx={{
                      bgcolor: pesquisaRespondidaByEmail[p.email] ? '#EEF2FF' : '#FFF3CD',
                      color: pesquisaRespondidaByEmail[p.email] ? '#4F46E5' : '#856404',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                {pesquisaRespondidaByEmail[p.email] ? (
                  <Tooltip title="Download PDF liberado">
                    <IconButton size="small"><DownloadIcon fontSize="small" /></IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title={pesquisaEnviada ? 'Aguardando resposta da pesquisa para habilitar download' : 'Selecione um modelo para enviar a pesquisa'}>
                    <span>
                      <IconButton size="small" disabled><DownloadIcon fontSize="small" /></IconButton>
                    </span>
                  </Tooltip>
                )}
                {!pesquisaRespondidaByEmail[p.email] && (
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 9999, fontSize: '0.72rem' }}
                    onClick={() => marcarPesquisaRespondida(p.email, p.nome)}
                  >
                    Marcar pesquisa respondida
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />
        {sectionTitle(<StarRateIcon fontSize="small" />, 'Feedback dos Participantes')}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {[1, 2, 3, 4, 5].map(i => i <= 4
            ? <StarIcon key={i} sx={{ color: '#F59E0B', fontSize: 22 }} />
            : <StarOutlineIcon key={i} sx={{ color: '#CBD5E1', fontSize: 22 }} />
          )}
          <Typography variant="body2" sx={{ ml: 1, color: '#64748B' }}>
            4.0 / 5.0 ({presentesCount} avaliações)
          </Typography>
        </Box>

        {demoActionRow(<>
          <Link href="/logs-acesso" passHref style={{ textDecoration: 'none' }}>
            <Button variant="outlined" startIcon={<OpenInNewIcon />} sx={{ borderRadius: 9999 }}>Ver Certificados</Button>
          </Link>
          <Link href="/logs-acesso" passHref style={{ textDecoration: 'none' }}>
            <Button variant="outlined" startIcon={<EmailIcon />} sx={{ borderRadius: 9999 }}>Auditoria de E-mails</Button>
          </Link>
        </>)}
      </CardContent>
    </Card>
  );

  const DEMO_PANELS: Record<number, () => React.ReactNode> = {
    1: renderStage1, 2: renderStage2, 3: renderStage3,
    4: renderStage4,
  };

  // ─── JSX ──────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>

      {/* ── HEADER ── */}
      <Box sx={{ background: BRAND_GRADIENT, borderRadius: 4, p: '28px 32px 20px', mb: 3, color: '#fff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccountTreeIcon sx={{ fontSize: 48, color: ACCENT }} />
            <Box>
              <Typography variant="h5" fontWeight={700} color="#fff">Fluxo Completo de Gestão de Eventos</Typography>
              <Typography variant="body2" sx={{ opacity: 0.75 }}>Demonstração interativa end-to-end — do pedido ao certificado</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={resetDemo}
              sx={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.35)', borderRadius: 9999, '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
              Novo Evento
            </Button>
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75, fontSize: '0.8rem', opacity: 0.8 }}>
            <span>Progresso do fluxo</span>
            <strong>{completedCount} / {stages.length} etapas concluídas</strong>
          </Box>
          <LinearProgress variant="determinate" value={progressValue}
            sx={{ borderRadius: 2, height: 8, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: ACCENT } }} />
        </Box>
      </Box>

      {/* ── PIPELINE ── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0, p: 3, bgcolor: '#F9FAFB', borderRadius: 3, mb: 3, overflowX: 'auto' }}>
        {stages.map((stage, idx) => {
          const s = STATUS_COLORS[stage.status];
          const isSelected = stage.id === selectedId;
          const isCompleted = stage.status === 'completed';
          const isActive = stage.status === 'active';
          const isRejected = stage.status === 'rejected';

          return (
            <Box key={stage.id} sx={{ display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
              {/* Connector */}
              {idx > 0 && (
                <Box sx={{
                  width: 48, height: 2, mt: '27px', flexShrink: 0,
                  bgcolor: isCompleted || (statuses[idx - 1] === 'completed' && isActive)
                    ? ACCENT_DARK : '#E2E8F0',
                }} />
              )}
              <Tooltip title={stage.title}>
                <Box
                  onClick={() => setSelectedId(stage.id)}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer', minWidth: 110, px: 0.5,
                    transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}
                >
                  {/* Circle */}
                  <Box sx={{
                    width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `3px solid ${isSelected ? ACCENT_DARK : isCompleted ? ACCENT_DARK : isRejected ? '#DC2626' : isActive ? '#F59E0B' : '#E2E8F0'}`,
                    bgcolor: isCompleted ? ACCENT_DARK : isRejected ? '#DC2626' : isActive ? '#FFFBEB' : '#fff',
                    color: isCompleted || isRejected ? '#fff' : isActive ? '#F59E0B' : '#64748B',
                    boxShadow: isSelected ? `0 0 0 4px ${ACCENT}33` : 'none',
                    animation: isActive ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%, 100%': { boxShadow: `0 0 0 0 ${ACCENT}66` },
                      '50%': { boxShadow: `0 0 0 8px ${ACCENT}00` },
                    },
                  }}>
                    {isCompleted ? <CheckCircleIcon fontSize="small" />
                      : isRejected ? <CancelIcon fontSize="small" />
                        : isActive ? stage.icon
                          : <Typography fontWeight={700} fontSize="1.1rem">{stage.id}</Typography>}
                  </Box>
                  {/* Label */}
                  <Box textAlign="center">
                    <Typography variant="caption" fontWeight={600} sx={{ display: 'block', maxWidth: 100, lineHeight: 1.2, color: '#0F172A' }}>
                      {stage.title}
                    </Typography>
                    <Box component="span" sx={{
                      display: 'inline-block', fontSize: '0.6rem', fontWeight: 700, mt: 0.3,
                      px: 0.75, py: 0.2, borderRadius: '6px', bgcolor: s.bg, color: s.color,
                    }}>
                      {s.label}
                    </Box>
                  </Box>
                </Box>
              </Tooltip>
            </Box>
          );
        })}
      </Box>

      {/* ── DETAIL ── */}
      {selectedStage ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' }, gap: 2.5, alignItems: 'start' }}>

          {/* Main column */}
          <Box>
            {/* Stage header */}
            <Card sx={{ ...cardSx, mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
                  <Box sx={{ width: 64, height: 64, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    bgcolor: COLOR_MAP[selectedStage.color], color: '#fff', '& svg': { fontSize: 30 } }}>
                    {selectedStage.icon}
                  </Box>
                  <Box flex={1} minWidth={200}>
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, color: '#64748B', fontWeight: 600 }}>
                      Etapa {selectedStage.id} de {stages.length}
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>{selectedStage.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{selectedStage.subtitle}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: '#F1F5F9', borderRadius: 9999, px: 1.5, py: 0.75, fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {selectedStage.roleIcon}
                    <span>{selectedStage.role}</span>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{selectedStage.description}</Typography>
              </CardContent>
            </Card>

            {/* Demo panel */}
            {DEMO_PANELS[selectedStage.id]?.()}
          </Box>

          {/* Sidebar */}
          <Box>
            {/* Input */}
            <Card sx={cardSx}>
              <CardHeader avatar={<InputIcon sx={{ color: '#64748B' }} />} title="Entrada (Input)" titleTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }} />
              <CardContent><Typography variant="body2" color="text.secondary">{selectedStage.input}</Typography></CardContent>
            </Card>

            {/* Output */}
            <Card sx={cardSx}>
              <CardHeader avatar={<OutputIcon sx={{ color: '#64748B' }} />} title="Saída (Output)" titleTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }} />
              <CardContent><Typography variant="body2" color="text.secondary">{selectedStage.output}</Typography></CardContent>
            </Card>

            {/* Tools */}
            <Card sx={cardSx}>
              <CardHeader avatar={<BuildIcon sx={{ color: '#64748B' }} />} title="Ferramentas" titleTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }} />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  {selectedStage.tools.map(t => (
                    <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#F9FAFB', borderRadius: 1.5, px: 1.25, py: 0.75, fontSize: '0.82rem' }}>
                      <CheckCircleIcon sx={{ color: ACCENT_DARK, fontSize: 16, flexShrink: 0 }} />
                      {t}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card sx={cardSx}>
              <CardHeader avatar={<PlayCircleIcon sx={{ color: '#64748B' }} />} title="Ações" titleTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }} />
              <CardContent>
                {selectedStage.route && (
                  <Link href={selectedStage.route} passHref style={{ textDecoration: 'none', display: 'block', marginBottom: 8 }}>
                    <Button variant="outlined" fullWidth startIcon={<OpenInNewIcon />} sx={{ borderRadius: 9999, justifyContent: 'flex-start' }}>
                      {selectedStage.routeLabel}
                    </Button>
                  </Link>
                )}
                {(selectedStage.status === 'pending' || selectedStage.status === 'active') && (
                  <Button variant="contained" fullWidth startIcon={<ArrowForwardIcon />}
                    sx={{ bgcolor: BLACK, borderRadius: 9999, justifyContent: 'flex-start', '&:hover': { bgcolor: '#1E293B' } }}
                    onClick={() => advanceStageById(selectedStage.id)}>
                    {selectedStage.actionLabel ?? 'Avançar Etapa'}
                  </Button>
                )}
                {selectedStage.status === 'completed' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#E6FDF1', borderRadius: 2, p: 1.5, color: ACCENT_DARK, fontWeight: 600 }}>
                    <CheckCircleIcon /> Etapa Concluída
                  </Box>
                )}
                {selectedStage.status === 'rejected' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#FEE2E2', borderRadius: 2, p: 1.5, color: '#DC2626', fontWeight: 600 }}>
                    <CancelIcon /> Etapa Reprovada
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Event info */}
            <Card sx={cardSx}>
              <CardHeader avatar={<EventIcon sx={{ color: '#64748B' }} />} title="Evento em Demonstração" titleTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }} />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  {[
                    { icon: <EventIcon fontSize="small" />, text: MOCK_EVENTO.nome },
                    { icon: <CategoryIcon fontSize="small" />, text: `${MOCK_EVENTO.tipo} · ${MOCK_EVENTO.formato}` },
                    { icon: <CalendarTodayIcon fontSize="small" />, text: MOCK_EVENTO.data },
                    { icon: <LocationOnIcon fontSize="small" />, text: MOCK_EVENTO.local },
                    { icon: <SchoolIcon fontSize="small" />, text: `Prof. ${MOCK_EVENTO.professor}` },
                    { icon: <GroupIcon fontSize="small" />, text: `${inscritosCount} / ${MOCK_EVENTO.vagas} inscritos` },
                  ].map((row, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, fontSize: '0.82rem', color: '#374151' }}>
                      <Box sx={{ color: '#7B1CE5', flexShrink: 0, mt: 0.15 }}>{row.icon}</Box>
                      <span>{row.text}</span>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, color: '#CBD5E1', gap: 1.5 }}>
          <AccountTreeIcon sx={{ fontSize: 48 }} />
          <Typography>Selecione uma etapa acima para ver os detalhes</Typography>
        </Box>
      )}

      {/* Snackbar */}
      {snackMsg && <Snackbar msg={snackMsg} onClose={() => setSnackMsg('')} />}
    </Box>
  );
}
