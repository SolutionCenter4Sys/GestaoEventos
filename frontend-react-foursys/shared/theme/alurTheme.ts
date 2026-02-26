import { createTheme } from '@mui/material/styles';

/**
 * Design System PG V2 — Gestão de Eventos e Formação (ALUR MEDICAL)
 * Paleta: azul escuro, azul claro/ciano, branco e cinzas neutros
 */
export const alurTheme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6', // color-primary-500
      light: '#60a5fa', // color-primary-400
      dark: '#2563eb', // color-primary-800
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1e3a5f', // color-primary-900 (sidebar)
      light: '#334155',
      dark: '#0f172a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // color-neutral-100
      paper: '#ffffff', // color-neutral-50
    },
    text: {
      primary: '#0f172a', // color-neutral-900
      secondary: '#334155', // color-neutral-700
      disabled: '#64748b', // color-neutral-500
    },
    divider: '#e2e8f0', // color-neutral-200
    error: { main: '#ef4444' },
    warning: { main: '#f59e0b' },
    success: { main: '#10b981' },
    info: { main: '#3b82f6' },
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
    borderRadius: 8, // radius-md
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
          },
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
          backgroundColor: '#f8fafc',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#334155',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#e2e8f0',
          padding: '12px 16px',
        },
      },
    },
  },
});
