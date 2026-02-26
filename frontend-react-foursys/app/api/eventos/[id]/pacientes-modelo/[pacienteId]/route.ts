import { NextResponse } from 'next/server';
import { MOCK_PACIENTES_MODELO } from '@/data/mock/mockData';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; pacienteId: string }> }
) {
  const { id, pacienteId } = await params;
  const pacientes = MOCK_PACIENTES_MODELO[id] || [];
  const paciente = pacientes.find((p) => p.id === pacienteId);
  if (!paciente) return NextResponse.json({ message: 'Paciente não encontrado' }, { status: 404 });
  return NextResponse.json(paciente);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; pacienteId: string }> }
) {
  const { pacienteId } = await params;
  const body = await request.json();
  return NextResponse.json({ id: pacienteId, ...body });
}
