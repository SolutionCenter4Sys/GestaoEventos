import { NextResponse } from 'next/server';
import { MOCK_PERFIS, MOCK_USUARIOS_PERFIL } from '@/data/mock/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const usuarios = searchParams.get('usuarios');
  if (usuarios === '1') {
    return NextResponse.json(MOCK_USUARIOS_PERFIL);
  }
  return NextResponse.json(MOCK_PERFIS);
}
