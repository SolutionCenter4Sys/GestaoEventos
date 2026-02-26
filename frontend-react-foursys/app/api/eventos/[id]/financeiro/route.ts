import { NextResponse } from 'next/server';
import { MOCK_EVENTOS, MOCK_FINANCEIRO_EVENTOS, MockFinanceiroItem } from '@/data/mock/mockData';

type FinanceiroPayload = {
  itens: MockFinanceiroItem[];
  updatedAt?: string;
};

const financeiroStore: Record<string, FinanceiroPayload> = Object.fromEntries(
  Object.entries(MOCK_FINANCEIRO_EVENTOS).map(([eventoId, itens]) => [
    eventoId,
    { itens, updatedAt: new Date().toISOString() },
  ])
);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const evento = MOCK_EVENTOS.find((e) => e.id === id);
  if (!evento) return NextResponse.json({ message: 'Evento não encontrado' }, { status: 404 });

  const payload = financeiroStore[id] ?? { itens: [], updatedAt: null };
  return NextResponse.json(payload);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const evento = MOCK_EVENTOS.find((e) => e.id === id);
  if (!evento) return NextResponse.json({ message: 'Evento não encontrado' }, { status: 404 });

  const body = await request.json() as Partial<FinanceiroPayload>;
  const itens = Array.isArray(body.itens) ? body.itens : [];

  financeiroStore[id] = {
    itens,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(financeiroStore[id]);
}
