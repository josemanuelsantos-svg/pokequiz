import { NextResponse } from 'next/server';
import { SessionStore } from '@/lib/storage';
import { SessionSettings } from '@/lib/types';
import { BOSS_PRESETS } from '@/lib/evolutions';

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

    if (session.settings?.bossModeEnabled) {
      const preset =
        BOSS_PRESETS.find((b) => b.id === session.settings?.bossId) || BOSS_PRESETS[0];
      const playerCount = Math.max(1, Object.keys(session.players || {}).length);
      const maxHp = Math.max(4000, playerCount * session.questions.length * 550);
      session.boss = {
        id: preset.id,
        name: preset.name,
        title: preset.title,
        artwork: preset.artwork,
        maxHp,
        hp: maxHp,
        defeated: false,
        lastHit: null,
      };
    } else {
      session.boss = null;
    }

    SessionStore.update(session);

    return NextResponse.json({ success: true, data: session });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al iniciar';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
