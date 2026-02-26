import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Providers } from '@/providers/Providers';
import { AuthGuard } from '@/presentation/components/AuthGuard';

export const metadata: Metadata = {
  title: 'Plataforma de Gestão de Eventos',
  description: 'Sistema de gestão de eventos — Design System Foursys',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <AuthGuard>{children}</AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
