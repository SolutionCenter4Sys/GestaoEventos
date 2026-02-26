import { NextResponse } from 'next/server';
import { MOCK_DASHBOARD_GERENCIAL } from '@/data/mock/mockData';

export async function GET() {
  return NextResponse.json(MOCK_DASHBOARD_GERENCIAL);
}
