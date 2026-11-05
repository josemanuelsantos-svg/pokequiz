import { NextResponse } from 'next/server';
import { QuizStore } from '@/lib/storage';
import { Quiz } from '@/lib/types';

export async function GET() {
  const quizzes = QuizStore.getAll();
  return NextResponse.json({ success: true, data: quizzes });
}

export async function POST(req: Request) {
  try {
    const body: Quiz = await req.json();

    if (!body.title || !body.questions || body.questions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'El quiz debe tener un título y al menos una pregunta.' },
        { status: 400 }
      );
    }

    if (!body.id) {
      body.id = 'quiz_' + Math.random().toString(36).substring(2, 9);
    }

    const saved = QuizStore.save(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
