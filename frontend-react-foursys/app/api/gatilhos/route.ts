import { NextResponse } from 'next/server';
import { MOCK_GATILHOS, MOCK_GATILHOS_HISTORICO } from '@/data/mock/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const historico = searchParams.get('historico');
  if (historico === '1') {
    return NextResponse.json(MOCK_GATILHOS_HISTORICO);
  }
  return NextResponse.json(MOCK_GATILHOS);
}
