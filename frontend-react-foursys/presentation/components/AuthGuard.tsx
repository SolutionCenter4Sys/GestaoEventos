'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppSelector';

const PUBLIC_PATHS = [
  '/login',
  '/recuperar-senha',
  '/resetar-senha',
  '/politica-privacidade',
  '/config-2fa',
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((s) => s.auth.user);

  const isPublic = PUBLIC_PATHS.some((p) => pathname?.startsWith(p)) ||
    pathname?.startsWith('/inscricao/') ||
    pathname === '/inscricao-confirmada';

  useEffect(() => {
    if (!user && !isPublic && pathname !== '/') {
      router.replace('/login');
    }
  }, [user, isPublic, pathname, router]);

  if (!user && !isPublic && pathname !== '/') {
    return null;
  }

  return <>{children}</>;
}
