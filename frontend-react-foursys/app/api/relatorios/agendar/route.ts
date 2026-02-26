import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    message: 'Relatório agendado com sucesso',
    id: 'rel-' + Date.now(),
    ...body,
  });
}
