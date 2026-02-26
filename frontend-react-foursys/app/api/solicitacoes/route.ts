import { NextResponse } from 'next/server';
import { MOCK_SOLICITACOES } from '@/data/mock/mockData';

export async function GET() {
  return NextResponse.json(MOCK_SOLICITACOES);
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ id: 'sol-new', ...body }, { status: 201 });
}
