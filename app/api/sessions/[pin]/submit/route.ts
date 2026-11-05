import { NextResponse } from 'next/server';
import { SessionStore } from '@/lib/storage';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ pin: string }> }
) {
  try {
    const { pin } = await params;
    const { playerId, questionId, selectedOptionId, timeSpent, doubleExp } = await req.json();

    const session = SessionStore.get(pin);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Sala no encontrada' }, { status: 404 });
    }

    const player = session.players[playerId];
    if (!player) {
      return NextResponse.json({ success: false, error: 'Jugador no encontrado' }, { status: 404 });
    }

    const question = session.questions.find(q => q.id === questionId);
    if (!question) {
      return NextResponse.json({ success: false, error: 'Pregunta no encontrada' }, { status: 404 });
    }

    const correctOption = question.options.find(o => o.isCorrect);

    // Idempotency guard: prevent double-tap or network retry from recording duplicate answers for the same question
    const existingAnswer = player.answers.find(a => a.questionId === questionId);
    if (existingAnswer) {
      return NextResponse.json({
        success: true,
        data: {
          isCorrect: existingAnswer.isCorrect,
          scoreEarned: existingAnswer.scoreEarned,
          correctOptionId: correctOption?.id,
          explanation: question.explanation,
          totalScore: player.score,
          streak: player.streak,
          currentQuestionIndex: player.currentQuestionIndex,
          totalQuestions: session.questions.length,
          isFinished: player.isFinished
        }
      });
    }

    const isCorrect = correctOption?.id === selectedOptionId;

    // Quizizz-style scoring:
    // Base points up to 1000 based on speed (minimum 600 for a correct answer, up to 1000)
    let scoreEarned = 0;
    if (isCorrect) {
      const maxTime = question.timeLimit || 20;
      const safeTimeSpent = Math.max(0.5, Math.min(timeSpent || 1, maxTime));
      const speedRatio = Math.max(0, 1 - (safeTimeSpent / maxTime));
      const basePoints = Math.round(600 + speedRatio * 400);

      // Streak bonus: +100 for streak >= 2, +200 for streak >= 3
      const currentStreak = player.streak + 1;
      const streakBonus = currentStreak >= 3 ? 200 : (currentStreak === 2 ? 100 : 0);

      scoreEarned = basePoints + streakBonus;
      if (doubleExp) {
        scoreEarned *= 2;
      }
      player.streak = currentStreak;
      if (player.streak > player.highestStreak) {
        player.highestStreak = player.streak;
      }
    } else {
      player.streak = 0;
    }

    player.score += scoreEarned;
    player.lastActiveAt = Date.now();

    player.answers.push({
      questionId,
      selectedOptionId,
      isCorrect,
      scoreEarned,
      timeSpent: timeSpent || 0,
      answeredAt: Date.now()
    });

    player.currentQuestionIndex = player.answers.length;

    if (player.currentQuestionIndex >= session.questions.length) {
      player.isFinished = true;
      player.finishedAt = Date.now();
    }

    SessionStore.update(session);

    return NextResponse.json({
      success: true,
      data: {
        isCorrect,
        scoreEarned,
        correctOptionId: correctOption?.id,
        explanation: question.explanation,
        totalScore: player.score,
        streak: player.streak,
        currentQuestionIndex: player.currentQuestionIndex,
        totalQuestions: session.questions.length,
        isFinished: player.isFinished
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al procesar respuesta';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
