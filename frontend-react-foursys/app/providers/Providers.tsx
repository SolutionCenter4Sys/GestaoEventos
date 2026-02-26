'use client';

import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from '../store';
import { alurTheme } from '@/shared/theme/alurTheme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={alurTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
