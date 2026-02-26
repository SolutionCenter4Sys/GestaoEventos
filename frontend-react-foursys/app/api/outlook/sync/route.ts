import { NextResponse } from 'next/server';
import { MOCK_OUTLOOK_SYNC } from '@/data/mock/mockData';

export async function GET() {
  return NextResponse.json(MOCK_OUTLOOK_SYNC);
}
