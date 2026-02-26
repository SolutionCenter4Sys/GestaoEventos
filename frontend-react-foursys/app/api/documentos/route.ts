import { NextResponse } from 'next/server';
import { MOCK_DOCUMENTOS } from '@/data/mock/mockData';

export async function GET() {
  return NextResponse.json(MOCK_DOCUMENTOS);
}
