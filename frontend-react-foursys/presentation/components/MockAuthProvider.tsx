'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setUser } from '@/store/authSlice';

const MOCK_USER = {
  id: 'mock-user-1',
  email: 'organizador@alurmedical.com',
  name: 'Organizador',
  roles: ['admin', 'marketing', 'vendas', 'professor', 'participante'],
};

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const isMock = process.env.NEXT_PUBLIC_MOCK === '1';

  useEffect(() => {
    if (isMock && !user) {
      dispatch(setUser(MOCK_USER));
    }
  }, [isMock, user, dispatch]);

  return <>{children}</>;
}
