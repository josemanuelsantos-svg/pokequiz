import { NextResponse } from 'next/server';
import { SessionStore } from '@/lib/storage';
import { WeatherType } from '@/lib/types';

const VALID_WEATHERS: WeatherType[] = ['sunny', 'storm', 'shield', 'rain'];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ pin: string }> }
) {
  try {
    const { pin } = await params;
    const body = await req.json().catch(() => ({}));
    const requested = body?.weatherType as WeatherType | undefined;

    const session = SessionStore.get(pin);
    if (!session || session.status !== 'active') {
      return NextResponse.json({ success: false, error: 'El combate no está activo' }, { status: 404 });
    }

    const chosen: WeatherType =
      requested && VALID_WEATHERS.includes(requested)
        ? requested
        : VALID_WEATHERS[Math.floor(Math.random() * VALID_WEATHERS.length)];

    const now = Date.now();
    session.activeWeather = {
      type: chosen,
      activatedAt: now,
      expiresAt: now + 25000,
    };

    SessionStore.update(session);
    return NextResponse.json({ success: true, data: session.activeWeather });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al activar clima';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
