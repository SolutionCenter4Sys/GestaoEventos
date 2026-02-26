import { NextResponse } from 'next/server';
import { MOCK_EVENTOS } from '@/data/mock/mockData';

export async function GET() {
  return NextResponse.json(MOCK_EVENTOS);
}

export async function POST(request: Request) {
  // Em modo mock, simula sucesso
  const body = await request.json();
  return NextResponse.json({ id: 'ev-new', ...body }, { status: 201 });
}
