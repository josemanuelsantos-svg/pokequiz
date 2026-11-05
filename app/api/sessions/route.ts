import { NextResponse } from 'next/server';
import { QuizStore, SessionStore } from '@/lib/storage';
import { Quiz } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const { quizId, quiz: clientQuiz }: { quizId?: string; quiz?: Quiz } = await req.json();

    if (!quizId && !clientQuiz) {
      return NextResponse.json({ success: false, error: 'Se requiere quizId' }, { status: 400 });
    }

    let quiz = quizId ? QuizStore.getById(quizId) : null;

    // If serverless container cold-started, restore quiz from client payload
    if (!quiz && clientQuiz && clientQuiz.title && clientQuiz.questions?.length) {
      quiz = QuizStore.save(clientQuiz);
    }

    if (!quiz) {
      return NextResponse.json({ success: false, error: 'Quiz no encontrado' }, { status: 404 });
    }

    const session = SessionStore.create(quiz);
    return NextResponse.json({ success: true, data: session });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al crear la sesión';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
