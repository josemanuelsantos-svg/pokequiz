import { NextResponse } from 'next/server';
import { SessionStore } from '@/lib/storage';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ pin: string }> }
) {
  const { pin } = await params;
  const session = SessionStore.get(pin);

  if (!session) {
    return NextResponse.json({ success: false, error: 'Código PIN no válido o sala expirada' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: session });
}
