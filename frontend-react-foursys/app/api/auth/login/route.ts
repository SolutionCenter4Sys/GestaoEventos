import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    access_token: 'mock-token-' + Date.now(),
    user: {
      id: 'mock-user-1',
      email: body.email || 'organizador@alurmedical.com',
      name: 'Organizador',
      roles: ['admin', 'marketing', 'vendas', 'professor', 'participante'],
    },
  });
}
