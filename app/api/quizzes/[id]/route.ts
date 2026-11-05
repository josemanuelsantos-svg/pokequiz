import { NextResponse } from 'next/server';
import { QuizStore } from '@/lib/storage';
import { Quiz } from '@/lib/types';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quiz = QuizStore.getById(id);

  if (!quiz) {
    return NextResponse.json({ success: false, error: 'Quiz no encontrado' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: quiz });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Quiz = await req.json();
    body.id = id;

    const saved = QuizStore.save(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al actualizar';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = QuizStore.delete(id);

  if (!deleted) {
    return NextResponse.json({ success: false, error: 'Quiz no encontrado' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
