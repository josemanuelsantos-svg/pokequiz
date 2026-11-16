import { NextResponse } from 'next/server';
import { SessionStore } from '@/lib/storage';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ pin: string }> }
) {
  try {
    const { pin } = await params;
    const { playerId, attackType, targetPlayerId } = await req.json();

    if (attackType !== 'paralyze' && attackType !== 'steal_time') {
      return NextResponse.json({ success: false, error: 'Tipo de ataque no válido' }, { status: 400 });
    }

    const session = SessionStore.get(pin);
    if (!session || session.status !== 'active') {
      return NextResponse.json({ success: false, error: 'El combate no está activo' }, { status: 404 });
    }

    if (session.settings?.pvpAttacksEnabled === false) {
      return NextResponse.json({ success: false, error: 'Los ataques PvP están desactivados' }, { status: 403 });
    }

    const attacker = session.players[playerId];
    if (!attacker) {
      return NextResponse.json({ success: false, error: 'Jugador no encontrado' }, { status: 404 });
    }

    if (!attacker.attackCharges || attacker.attackCharges <= 0) {
      return NextResponse.json({ success: false, error: 'No tienes cargas de ataque disponibles' }, { status: 400 });
    }

    const now = Date.now();
    // Pick active opponents who haven't finished yet
    const candidates = Object.values(session.players).filter(
      (p) => p.id !== playerId && !p.isFinished
    );

    if (candidates.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No hay rivales activos en este momento para atacar',
      }, { status: 400 });
    }

    // Prefer explicitly chosen active target, otherwise pick among top 3 rivals
    const explicitTarget = targetPlayerId
      ? candidates.find((c) => c.id === targetPlayerId)
      : undefined;

    let target = explicitTarget;
    if (!target) {
      const freshCandidates = candidates.filter(
        (c) => !c.activeEffect || c.activeEffect.expiresAt < now
      );
      const pool = freshCandidates.length > 0 ? freshCandidates : candidates;
      const sorted = [...pool].sort((a, b) => b.score - a.score);
      // Pick among the top 3 rivals so leaders feel the heat!
      const topSlice = sorted.slice(0, Math.min(3, sorted.length));
      target = topSlice[Math.floor(Math.random() * topSlice.length)];
    }

    attacker.attackCharges = Math.max(0, (attacker.attackCharges || 1) - 1);

    const effectId = 'atk_' + Math.random().toString(36).substring(2, 9);
    target.activeEffect = {
      id: effectId,
      type: attackType,
      fromNickname: attacker.nickname,
      fromAvatar: attacker.avatar,
      createdAt: now,
      expiresAt: now + 8000,
    };

    const logText =
      attackType === 'paralyze'
        ? `⚡ ¡${attacker.nickname} lanzó IMPACTRUENO contra ${target.nickname} (Paralizado 3s)!`
        : `🔥 ¡${attacker.nickname} usó LLAMA TEMPORAL sobre ${target.nickname} (-5s)!`;

    session.battleLog = [
      { id: effectId, text: logText, type: attackType, createdAt: now },
      ...(session.battleLog || []),
    ].slice(0, 6);

    SessionStore.update(session);

    return NextResponse.json({
      success: true,
      data: {
        attackerNickname: attacker.nickname,
        attackerAvatar: attacker.avatar,
        targetNickname: target.nickname,
        targetAvatar: target.avatar,
        attackType,
        remainingCharges: attacker.attackCharges,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al lanzar ataque';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
