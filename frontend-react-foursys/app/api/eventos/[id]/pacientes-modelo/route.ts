import { NextResponse } from 'next/server';
import { MOCK_PACIENTES_MODELO } from '@/data/mock/mockData';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pacientes = MOCK_PACIENTES_MODELO[id] || [];
  return NextResponse.json(pacientes);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  return NextResponse.json({ id: 'pm-new', ...body }, { status: 201 });
}
