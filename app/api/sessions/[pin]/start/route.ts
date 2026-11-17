import { NextResponse } from 'next/server';
import { SessionStore } from '@/lib/storage';
import { SessionSettings } from '@/lib/types';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ pin: string }> }
) {
  try {
    const { pin } = await params;
    const session = SessionStore.get(pin);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Sala no encontrada' }, { status: 404 });
    }

    let settings: SessionSettings | undefined;
    try {
      const body = await req.json();
      if (body && body.settings) {
        settings = body.settings;
      }
    } catch {
      // Optional body
    }

    if (settings) {
      session.settings = settings;
    } else if (!session.settings) {
      session.settings = {
        shuffleQuestions: false,
        shuffleOptions: true,
        showExplanations: true,
        powerUpsEnabled: true,
        pvpAttacksEnabled: true,
      };
    }

    session.status = 'active';
    session.startedAt = Date.now();
    session.teacherCurrentIndex = 0;
    session.questionClosed = false;
    session.bonusTimePulse = null;
    SessionStore.update(session);

    return NextResponse.json({ success: true, data: session });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al iniciar';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
