import { createTheme } from '@mui/material/styles';

/**
 * Design System Foursys — Plataforma Gestão de Eventos
 * Base: design-toolkit-17-12.md
 * - Primary: #000000 (Soft: #F1F5F9)
 * - Accent: #18C964 (Soft: #E6FDF1)
 * - Gradiente: linear-gradient(135deg, #9A1BFF 0%, #7B1CE5 40%, #4F46E5 100%)
 * - Radius: LG 20px, Pill 999px
 * - Inputs: altura 40px, raio LG 20px
 * - Botões: raio Pill
 */
export const foursysTheme = createTheme({
  palette: {
    primary: {
      main: '#000000',
      light: '#334155',
      dark: '#0F172A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#18C964',
      light: '#22C55E',
      dark: '#16A34A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F3FF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
      disabled: '#94A3B8',
    },
    divider: '#E2E8F0',
    error: { main: '#DC2626' },
    warning: { main: '#F59E0B' },
    success: { main: '#16A34A' },
    info: { main: '#2563EB' },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.35 },
    h4: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '1rem', fontWeight: 600 },
    h6: { fontSize: '0.875rem', fontWeight: 600 },
    body1: { fontSize: '0.875rem', lineHeight: 1.5 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', lineHeight: 1.4 },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          borderRadius: 999,
          padding: '12px 24px',
          fontWeight: 600,
          transition: 'all 0.2s ease',
          boxShadow: '0 10px 25px rgba(15,23,42,0.06)',
          '&:hover': {
            boxShadow: '0 18px 45px rgba(15,23,42,0.10)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        containedPrimary: {
          backgroundColor: '#000000',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#1e293b',
          },
        },
        containedSecondary: {
          backgroundColor: '#18C964',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#16A34A',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 10px 25px rgba(15,23,42,0.06)',
          border: '1px solid #EEF2FF',
          backgroundColor: '#FFFFFF',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 18px 45px rgba(15,23,42,0.10)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 20,
            minHeight: 40,
            '& fieldset': {
              borderColor: '#E2E8F0',
            },
            '&:hover fieldset': {
              borderColor: '#64748B',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          height: 28,
          fontWeight: 500,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F9FAFB',
          borderBottom: '1px solid #E2E8F0',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#0F172A',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F9FAFB',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#E2E8F0',
          padding: '12px 16px',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 },
          '& .Mui-selected': { color: '#000000', fontWeight: 600 },
          '& .MuiTabs-indicator': { backgroundColor: '#18C964', height: 3, borderRadius: '3px 3px 0 0' },
        },
      },
    },
  },
});
