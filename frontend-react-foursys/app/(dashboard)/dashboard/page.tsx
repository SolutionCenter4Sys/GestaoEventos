'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Card, CardContent, Typography, Tabs, Tab } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAppSelector } from '@/hooks/useAppSelector';

const MAIN_TABS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Solicitações', path: '/solicitacoes' },
  { label: 'Eventos', path: '/eventos' },
  { label: 'Participantes', path: '/eventos' },
  { label: 'Relatórios', path: '/relatorios' },
];

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const pathname = usePathname();
  const activeTab = MAIN_TABS.findIndex((t) => pathname === t.path);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#0f172a' }}>
        Gestão de Eventos e Formação
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Bem-vindo(a), {user?.name || user?.email}!
      </Typography>
      {/* Tabs — Design System: fundo ativo azul claro */}
      <Tabs
        value={activeTab >= 0 ? activeTab : 0}
        sx={{
          mb: 3,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 },
          '& .Mui-selected': { color: '#3b82f6', fontWeight: 600 },
          '& .MuiTabs-indicator': { backgroundColor: '#3b82f6', height: 3, borderRadius: '3px 3px 0 0' },
        }}
      >
        {MAIN_TABS.map((tab, idx) => (
          <Tab
            key={tab.path + idx}
            label={tab.label}
            component={Link}
            href={tab.path}
            sx={{ minHeight: 48 }}
          />
        ))}
      </Tabs>
      {/* Cards — Design System: Próximos Eventos, Visão geral */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ p: 1, borderRadius: 1, bgcolor: '#dbeafe', color: '#3b82f6' }}>
              <CalendarMonthIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600} color="text.primary">
                Próximos Eventos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Consulte os eventos agendados no menu lateral.
              </Typography>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ p: 1, borderRadius: 1, bgcolor: '#dbeafe', color: '#3b82f6' }}>
              <LocationOnIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600} color="text.primary">
                Locais e Capacidade
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gerencie locais e participantes dos eventos.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Visão geral
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Utilize o menu lateral para acessar as funcionalidades disponíveis conforme seu perfil.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
