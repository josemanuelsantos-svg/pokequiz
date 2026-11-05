import { NextResponse } from 'next/server';
import { SessionStore } from '@/lib/storage';
import { Player } from '@/lib/types';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ pin: string }> }
) {
  try {
    const { pin } = await params;
    const { nickname, avatar } = await req.json();

    const session = SessionStore.get(pin);
    if (!session) {
      return NextResponse.json({ success: false, error: 'La sala no existe o ha terminado' }, { status: 404 });
    }

    if (!nickname || nickname.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Por favor introduce un nombre o apodo' }, { status: 400 });
    }

    // Generate unique playerId
    const playerId = 'p_' + Math.random().toString(36).substring(2, 9);

    const player: Player = {
      id: playerId,
      nickname: nickname.trim().substring(0, 20),
      avatar: avatar || '🚀',
      score: 0,
      streak: 0,
      highestStreak: 0,
      currentQuestionIndex: 0,
      answers: [],
      isFinished: false,
      joinedAt: Date.now(),
      lastActiveAt: Date.now()
    };

    session.players[playerId] = player;
    SessionStore.update(session);

    return NextResponse.json({ success: true, data: { playerId, player } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al unirse';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
