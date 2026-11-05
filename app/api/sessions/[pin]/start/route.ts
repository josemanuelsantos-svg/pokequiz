import { NextResponse } from 'next/server';
import { SessionStore } from '@/lib/storage';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ pin: string }> }
) {
  try {
    const { pin } = await params;
    const session = SessionStore.get(pin);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Sala no encontrada' }, { status: 404 });
    }

    session.status = 'active';
    session.startedAt = Date.now();
    SessionStore.update(session);

    return NextResponse.json({ success: true, data: session });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al iniciar';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
