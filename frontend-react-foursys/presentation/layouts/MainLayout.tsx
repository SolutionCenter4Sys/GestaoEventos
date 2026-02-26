'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { logout } from '@/store/authSlice';
import { getMenuItemsForRoles } from '@/shared/constants/menu';

const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 56;
const MOCK_BANNER_HEIGHT = 32;
const getHeaderTop = () => (process.env.NEXT_PUBLIC_MOCK === '1' ? HEADER_HEIGHT + MOCK_BANNER_HEIGHT : HEADER_HEIGHT);

const GRADIENT_BRAND = 'linear-gradient(135deg, #9A1BFF 0%, #7B1CE5 40%, #4F46E5 100%)';
const GRADIENT_SIDEBAR = 'linear-gradient(180deg, #4F46E5 0%, #7B1CE5 50%, #9A1BFF 100%)';

const iconMap: Record<string, React.ReactNode> = {
  dashboard: <DashboardIcon />,
  event: <EventIcon />,
  analytics: <AssessmentIcon />,
  person: <PeopleIcon />,
  request_page: <AssessmentIcon />,
  folder_shared: <SettingsIcon />,
  sync_alt: <SettingsIcon />,
  security: <SettingsIcon />,
  emoji_events: <SettingsIcon />,
  email: <SettingsIcon />,
  privacy_tip: <SettingsIcon />,
  people: <PeopleIcon />,
  notifications_active: <SettingsIcon />,
  account_tree: <AccountTreeIcon />,
};

function getIcon(icon?: string) {
  if (!icon) return null;
  return iconMap[icon] ?? <DashboardIcon />;
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const menuItems = getMenuItemsForRoles(user?.roles ?? []);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#FFFFFF',
          color: '#0F172A',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 10px 25px rgba(15,23,42,0.06)',
        }}
      >
        {process.env.NEXT_PUBLIC_MOCK === '1' && (
          <Box
            sx={{
              py: 0.5,
              px: 2,
              background: GRADIENT_BRAND,
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            Modo demonstração — Design System Foursys (dados mock)
          </Box>
        )}
        <Toolbar sx={{ minHeight: 56 }}>
          <IconButton
            edge="start"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
            sx={{
              color: '#64748B',
              '&:hover': { color: '#000000', bgcolor: '#F1F5F9' },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
          <Typography variant="body2" sx={{ mr: 2, color: '#64748B' }}>
            {user?.email}
          </Typography>
          <IconButton
            aria-label="Sair"
            onClick={handleLogout}
            sx={{
              color: '#64748B',
              '&:hover': { color: '#000000', bgcolor: '#F1F5F9' },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: open ? SIDEBAR_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            top: getHeaderTop(),
            borderRight: 'none',
            background: GRADIENT_SIDEBAR,
            color: '#FFFFFF',
            boxShadow: '0 10px 25px rgba(15,23,42,0.06)',
          },
        }}
      >
        <Box sx={{ overflow: 'auto', py: 2, height: '100%' }}>
          <Box
            sx={{
              px: 2,
              py: 2,
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF', fontSize: '1.25rem' }}>
              GESTÃO DE EVENTOS
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.8125rem' }}>
              Design System Foursys
            </Typography>
          </Box>
          <List sx={{ pt: 1 }}>
            {menuItems.map((item) => {
              const isSelected = pathname === item.path;
              return (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={item.path}
                    selected={isSelected}
                    sx={{
                      mx: 1,
                      mb: 0.5,
                      borderRadius: '999px',
                      color: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.9)',
                      bgcolor: isSelected ? '#18C964' : 'transparent',
                      '&:hover': {
                        bgcolor: isSelected ? '#18C964' : 'rgba(255, 255, 255, 0.15)',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#18C964',
                        color: '#FFFFFF',
                        '&:hover': {
                          bgcolor: '#16A34A',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                      {getIcon(item.icon)}
                    </ListItemIcon>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: process.env.NEXT_PUBLIC_MOCK === '1' ? 14 : 10,
          bgcolor: '#F5F3FF',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
      <Box
        component="footer"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: open ? SIDEBAR_WIDTH : 0,
          right: 0,
          py: 1,
          px: 2,
          bgcolor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          textAlign: 'center',
        }}
      >
        <Link
          href="/politica-privacidade"
          style={{ color: '#18C964', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}
        >
          Política de Privacidade
        </Link>
      </Box>
    </Box>
  );
}
