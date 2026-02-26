import { NextResponse } from 'next/server';
import { MOCK_TEMPLATES_EMAIL } from '@/data/mock/mockData';

export async function GET() {
  return NextResponse.json(MOCK_TEMPLATES_EMAIL);
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ id: 'tpl-email-new', ...body }, { status: 201 });
}
