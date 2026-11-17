import { NextResponse } from 'next/server';
import { SessionStore } from '@/lib/storage';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ pin: string }> }
) {
  try {
    const { pin } = await params;
    const { action, seconds } = await req.json();

    const session = SessionStore.get(pin);
    if (!session || session.status !== 'active') {
      return NextResponse.json({ success: false, error: 'El combate no está activo' }, { status: 404 });
    }

    if (action === 'add_time') {
      const addSec = typeof seconds === 'number' && seconds > 0 ? seconds : 15;
      session.bonusTimePulse = {
        id: 'bt_' + Math.random().toString(36).substring(2, 9),
        seconds: addSec,
        createdAt: Date.now(),
      };
    } else if (action === 'close_question') {
      session.questionClosed = true;
    } else if (action === 'next_question') {
      const current = session.teacherCurrentIndex ?? 0;
      const nextIdx = current + 1;
      if (nextIdx >= session.questions.length) {
        session.status = 'finished';
        session.finishedAt = Date.now();
        session.questionClosed = false;
      } else {
        session.teacherCurrentIndex = nextIdx;
        session.questionClosed = false;
      }
    } else {
      return NextResponse.json({ success: false, error: 'Acción no válida' }, { status: 400 });
    }

    SessionStore.update(session);
    return NextResponse.json({ success: true, data: session });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al controlar el combate';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
