import { NextResponse } from 'next/server';
import { MOCK_EVENTOS } from '@/data/mock/mockData';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const evento = MOCK_EVENTOS.find((e) => e.id === id);
  if (!evento) return NextResponse.json({ message: 'Evento não encontrado' }, { status: 404 });
  return NextResponse.json(evento);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const evento = MOCK_EVENTOS.find((e) => e.id === id);
  if (!evento) return NextResponse.json({ message: 'Evento não encontrado' }, { status: 404 });
  const body = await request.json();
  return NextResponse.json({ id, ...body });
}
