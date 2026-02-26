import { NextResponse } from 'next/server';
import { MOCK_TEMPLATES_CERTIFICADO } from '@/data/mock/mockData';

export async function GET() {
  return NextResponse.json(MOCK_TEMPLATES_CERTIFICADO);
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ id: 'tpl-cert-new', ...body }, { status: 201 });
}
