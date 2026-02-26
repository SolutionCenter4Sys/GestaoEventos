import { NextResponse } from 'next/server';
import { MOCK_LOGS_AUDITORIA } from '@/data/mock/mockData';

export async function GET() {
  return NextResponse.json(MOCK_LOGS_AUDITORIA);
}
