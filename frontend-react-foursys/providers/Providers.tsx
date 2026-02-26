'use client';

import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from '@/store';
import { foursysTheme } from '@/shared/theme/foursysTheme';
import { ReCaptchaProvider } from '@/presentation/components/ReCaptchaProvider';
import { MockAuthProvider } from '@/presentation/components/MockAuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={foursysTheme}>
        <CssBaseline />
        <ReCaptchaProvider>
          <MockAuthProvider>
            {children}
          </MockAuthProvider>
        </ReCaptchaProvider>
      </ThemeProvider>
    </Provider>
  );
}
