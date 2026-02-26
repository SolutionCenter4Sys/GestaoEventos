import { NextResponse } from 'next/server';
import { MOCK_SOLICITACOES } from '@/data/mock/mockData';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const solicitacao = MOCK_SOLICITACOES.find((s) => s.id === id);
  if (!solicitacao) return NextResponse.json({ message: 'Solicitação não encontrada' }, { status: 404 });
  return NextResponse.json(solicitacao);
}
