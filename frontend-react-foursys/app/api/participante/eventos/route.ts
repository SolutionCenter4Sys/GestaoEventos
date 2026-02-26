import { NextResponse } from 'next/server';
import { MOCK_EVENTOS_PARTICIPANTE } from '@/data/mock/mockData';

export async function GET() {
  return NextResponse.json(MOCK_EVENTOS_PARTICIPANTE);
}
