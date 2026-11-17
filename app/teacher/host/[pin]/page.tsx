'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import * as XLSX from 'xlsx';
import { 
  Trophy, Users, Play, StopCircle, ArrowLeft, Sparkles, 
  Flame, CheckCircle, BarChart3, Clock, Share2, Volume2, VolumeX, 
  Music, Swords, Award, Zap, X, ChevronRight, HelpCircle, Eye, Download,
  Shuffle, AlertTriangle, ShieldCheck, Printer, CloudSun
} from 'lucide-react';
import { Session, Player, SessionSettings, WeatherType, RegionTeam } from '@/lib/types';
import { sounds } from '@/lib/sound';
import { PokeballIcon, GreatBallIcon, UltraBallIcon } from '@/components/Pokeball';
import { getRewardForRank, TOP_6_REWARDS } from '@/lib/rewards';
import { REGION_TEAMS, WEATHER_CONFIG } from '@/lib/teams';

export default function HostGamePage({ params }: { params: Promise<{ pin: string }> }) {
  const router = useRouter();
  const { pin } = use(params);

  const [session, setSession] = useState<Session | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Tab in finished mode: 'podium' or 'analytics'
  const [finishedTab, setFinishedTab] = useState<'podium' | 'analytics'>('podium');
  const [selectedQuestionModal, setSelectedQuestionModal] = useState<number | null>(null);
  const prevPlayerCountRef = useRef<number>(0);
  const [lobbySettings, setLobbySettings] = useState<SessionSettings>({
    shuffleQuestions: false,
    shuffleOptions: true,
    showExplanations: true,
    powerUpsEnabled: true,
    pvpAttacksEnabled: true,
    teamsEnabled: false,
    paceMode: 'free',
    questionDuration: 30,
  });
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [controlLoading, setControlLoading] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setSoundEnabled(next);
  };

  const toggleMusic = () => {
    const active = sounds.toggleMusic();
    setMusicEnabled(active);
  };

  const seenBattleLogIdsRef = useRef<Set<string>>(new Set());
  const [liveAttackFlash, setLiveAttackFlash] = useState<{ text: string; type: 'paralyze' | 'steal_time' } | null>(null);

  useEffect(() => {
    return () => {
      sounds.stopMusic();
    };
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch(`/api/sessions/${pin}`);
      const data = await res.json();
      if (data.success && data.data) {
        const incomingCount = Object.keys(data.data.players || {}).length;
        if (data.data.status === 'waiting' && incomingCount > prevPlayerCountRef.current && prevPlayerCountRef.current >= 0) {
          if (incomingCount > 0) sounds.playClick();
        }
        prevPlayerCountRef.current = incomingCount;

        // Detect new PvP attack on the live projector
        const latestAtk = data.data.battleLog?.[0];
        if (latestAtk && !seenBattleLogIdsRef.current.has(latestAtk.id)) {
          seenBattleLogIdsRef.current.add(latestAtk.id);
          if (data.data.status === 'active') {
            if (latestAtk.type === 'paralyze') {
              sounds.playElectricZap();
            } else {
              sounds.playTimeDrain();
            }
            setLiveAttackFlash({ text: latestAtk.text, type: latestAtk.type });
            setTimeout(() => setLiveAttackFlash(null), 2600);
          }
        }

        setSession(data.data);
      }
    } catch (err) {
      console.error('Error polling session:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
    const interval = setInterval(fetchSession, 1500);
    return () => clearInterval(interval);
  }, [pin]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const joinUrl = `${window.location.origin}/play/${pin}`;
      QRCode.toDataURL(joinUrl, { width: 320, margin: 1 })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error('Error generating QR:', err));
    }
  }, [pin]);

  const handleStartGame = async () => {
    sounds.playCorrect();
    try {
      const res = await fetch(`/api/sessions/${pin}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: lobbySettings }),
      });
      const data = await res.json();
      if (data.success) {
        setSession(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFinishGame = async () => {
    sounds.playFanfare();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });

    try {
      const res = await fetch(`/api/sessions/${pin}/finish`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSession(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleKickPlayer = async (playerId: string, nickname: string) => {
    if (!confirm(`¿Expulsar a "${nickname}" de la sala?`)) return;
    try {
      const res = await fetch(`/api/sessions/${pin}/kick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const incomingCount = Object.keys(data.data.players || {}).length;
        if (data.data.status === 'waiting' && incomingCount > prevPlayerCountRef.current && prevPlayerCountRef.current >= 0) {
          if (incomingCount > 0) sounds.playClick();
        }
        prevPlayerCountRef.current = incomingCount;

        // Detect new PvP attack on the live projector
        const latestAtk = data.data.battleLog?.[0];
        if (latestAtk && !seenBattleLogIdsRef.current.has(latestAtk.id)) {
          seenBattleLogIdsRef.current.add(latestAtk.id);
          if (data.data.status === 'active') {
            if (latestAtk.type === 'paralyze') {
              sounds.playElectricZap();
            } else {
              sounds.playTimeDrain();
            }
            setLiveAttackFlash({ text: latestAtk.text, type: latestAtk.type });
            setTimeout(() => setLiveAttackFlash(null), 2600);
          }
        }

        setSession(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyJoinLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/play/${pin}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleActivateWeather = async (weatherType?: WeatherType) => {
    if (weatherLoading) return;
    try {
      setWeatherLoading(true);
      sounds.playClick();
      const res = await fetch(`/api/sessions/${pin}/weather`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weatherType }),
      });
      const data = await res.json();
      if (data.success) {
        sounds.playCorrect();
        fetchSession();
      }
    } catch {
      // ignore
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleControlGame = async (action: 'add_time' | 'close_question' | 'next_question') => {
    if (controlLoading) return;
    try {
      setControlLoading(true);
      sounds.playClick();
      const res = await fetch(`/api/sessions/${pin}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, seconds: 15 }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSession(data.data);
        if (action === 'add_time') sounds.playCorrect();
      }
    } catch {
      // ignore
    } finally {
      setControlLoading(false);
    }
  };

  const printTop3Diplomas = () => {
    if (!session || typeof window === 'undefined') return;
    const top3 = playersList.slice(0, 3);
    if (top3.length === 0) return;

    const escapeHtml = (str: string) =>
      str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));

    const cardsHtml = top3
      .map((p, idx) => {
        const rank = idx + 1;
        const reward = getRewardForRank(rank);
        const medal = rank === 1 ? '🥇 1.º PUESTO - CAMPEÓN' : rank === 2 ? '🥈 2.º PUESTO - SUBCAMPEÓN' : '🥉 3.º PUESTO - PODIO';
        const border = rank === 1 ? '#f59e0b' : rank === 2 ? '#94a3b8' : '#b45309';
        const avatarHtml = p.avatar.startsWith('http')
          ? `<img src="${escapeHtml(p.avatar)}" alt="${escapeHtml(p.nickname)}" style="width:96px;height:96px;object-fit:contain;margin:8px auto;display:block;" />`
          : `<div style="font-size:64px;margin:8px 0;">${escapeHtml(p.avatar)}</div>`;
        return `
          <div class="diploma" style="border:6px solid ${border};">
            <div class="badge">${medal}</div>
            <h2>LIGA POKÉQUIZ DEL AULA</h2>
            <p class="subtitle">Se otorga el presente Diploma de Entrenador/a a:</p>
            ${avatarHtml}
            <h1>${escapeHtml(p.nickname)}</h1>
            <p class="quiz">${escapeHtml(session.quizTitle)} • <strong>${p.score.toLocaleString()} EXP</strong></p>
            <div class="rewards">🎁 ${escapeHtml(reward?.summary || '')}</div>
            <div class="footer">Firma del Líder de Gimnasio _______________________</div>
          </div>
        `;
      })
      .join('');

    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Diplomas Top 3 - ${escapeHtml(session.quizTitle)}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 20px; }
          .diploma { background: #fff; border-radius: 20px; padding: 28px 32px; margin-bottom: 24px; text-align: center; page-break-inside: avoid; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
          .badge { display: inline-block; background: #0f172a; color: #fbbf24; font-weight: 900; padding: 6px 16px; border-radius: 999px; font-size: 13px; letter-spacing: 1px; }
          h2 { margin: 12px 0 4px; font-size: 16px; color: #475569; letter-spacing: 2px; }
          .subtitle { margin: 4px 0 8px; font-size: 13px; color: #64748b; }
          h1 { margin: 6px 0; font-size: 32px; color: #0f172a; text-transform: uppercase; }
          .quiz { font-size: 14px; color: #334155; margin: 6px 0 12px; }
          .rewards { background: #fef3c7; border: 2px dashed #f59e0b; border-radius: 12px; padding: 10px 14px; font-weight: 800; font-size: 14px; color: #92400e; display: inline-block; }
          .footer { margin-top: 20px; font-size: 12px; color: #64748b; }
          @media print { body { background: #fff; padding: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align:center;margin-bottom:16px;">
          <button onclick="window.print()" style="padding:10px 20px;font-size:15px;font-weight:bold;background:#dc2626;color:#fff;border:none;border-radius:10px;cursor:pointer;">🖨️ Imprimir / Guardar como PDF</button>
        </div>
        ${cardsHtml}
      </body>
      </html>
    `);
    win.document.close();
  };

  const downloadExcelReport = () => {
    if (!session) return;

    // Sheet 1: Clasificación y Notas
    const summaryRows = playersList.map((p, idx) => {
      const correct = p.answers.filter((a) => a.isCorrect).length;
      const wrong = p.answers.length - correct;
      const pct = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
      const grade = Number(((correct / (totalQuestions || 1)) * 10).toFixed(2));
      const avgTime =
        p.answers.length > 0
          ? Number((p.answers.reduce((acc, a) => acc + (a.timeSpent || 0), 0) / p.answers.length).toFixed(1))
          : 0;
      const reward = getRewardForRank(idx + 1);
      return {
        'Posición': idx + 1,
        'Nombre Alumno': p.nickname,
        'Región': p.team || '-',
        'Puntuación EXP': p.score,
        'Aciertos': correct,
        'Fallos': wrong,
        'Total Preguntas': totalQuestions,
        '% Acierto': `${pct}%`,
        'Nota sobre 10': grade,
        'Mejor Racha': p.highestStreak,
        'Tiempo Medio (s)': avgTime,
        'EXP Aula': reward ? reward.expPoints : 0,
        'Pts Región': reward ? reward.regionPoints : 0,
        'Pokémon Ganado': reward?.pokemon ? 'Sí (+1)' : 'No',
        'Tarjeta Beneficio': reward?.benefitCard || '-',
        'Premio Liga Escolar': reward?.summary || '-',
      };
    });

    // Sheet 2: Análisis por Pregunta
    const questionRows = session.questions.map((q, idx) => {
      let correctCount = 0;
      let totalAnswers = 0;
      playersList.forEach((p) => {
        const ans = p.answers.find((a) => a.questionId === q.id);
        if (ans) {
          totalAnswers++;
          if (ans.isCorrect) correctCount++;
        }
      });
      const pct = totalAnswers > 0 ? Math.round((correctCount / totalAnswers) * 100) : 0;
      const correctOpt = q.options.find((o) => o.isCorrect)?.text || '';
      return {
        'Nº': idx + 1,
        'Enunciado': q.text,
        'Respuesta Correcta': correctOpt,
        'Aciertos': correctCount,
        'Total Respuestas': totalAnswers,
        '% Acierto': `${pct}%`,
        'Estado': pct < 50 ? 'Repasar en clase' : pct >= 75 ? 'Dominada' : 'Normal',
      };
    });

    // Sheet 3: Matriz Detalle por Alumno y Pregunta
    const detailRows = playersList.map((p) => {
      const row: Record<string, string | number> = {
        'Alumno': p.nickname,
        'EXP Total': p.score,
      };
      session.questions.forEach((q, idx) => {
        const ans = p.answers.find((a) => a.questionId === q.id);
        if (!ans) {
          row[`P${idx + 1}`] = '-';
        } else if (ans.isCorrect) {
          row[`P${idx + 1}`] = `OK (+${ans.scoreEarned})`;
        } else if (!ans.selectedOptionId) {
          row[`P${idx + 1}`] = 'Tiempo agotado';
        } else {
          row[`P${idx + 1}`] = 'Fallo';
        }
      });
      return row;
    });

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(summaryRows);
    const ws2 = XLSX.utils.json_to_sheet(questionRows);
    const ws3 = XLSX.utils.json_to_sheet(detailRows);

    XLSX.utils.book_append_sheet(wb, ws1, 'Clasificacion');
    XLSX.utils.book_append_sheet(wb, ws2, 'Analisis_Preguntas');
    XLSX.utils.book_append_sheet(wb, ws3, 'Detalle_Alumnos');

    const safeTitle = session.quizTitle
      .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40);

    XLSX.writeFile(wb, `Batalla_${safeTitle}_PIN_${session.pin}.xls`, { bookType: 'xls' });
  };

  if (loading && !session) {
    return (
      <div className="min-h-screen bg-pokemon-pattern flex items-center justify-center text-amber-300 font-pokemon">
        <PokeballIcon className="w-10 h-10 mr-3" spinning={true} />
        <span>Cargando Arena de Gimnasio...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-pokemon-pattern flex flex-col items-center justify-center p-4">
        <p className="text-xl font-bold text-white mb-4 font-pokemon">Sala no encontrada o ha caducado</p>
        <Link href="/teacher" className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold font-pokemon">
          Volver a la Biblioteca
        </Link>
      </div>
    );
  }

  const playersList: Player[] = Object.values(session.players || {}).sort((a, b) => b.score - a.score);
  const totalQuestions = session.questions.length;
  const finishedCount = playersList.filter(p => p.isFinished).length;

  return (
    <div className="min-h-screen bg-pokemon-pattern text-slate-100 flex flex-col justify-between">
      {/* Host Navigation Bar */}
      <header className="border-b border-red-900/50 bg-slate-900/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/teacher"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-[10px] font-pixel text-amber-400 uppercase tracking-widest block">
                {session.status === 'waiting' ? 'LOBBY DE ENTRADA' : session.status === 'active' ? 'COMBATE EN VIVO' : 'RESULTADOS FINALES'}
              </span>
              <h1 className="text-base font-black text-white font-pokemon uppercase truncate max-w-xs sm:max-w-md">
                {session.quizTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleMusic}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                musicEnabled ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title={musicEnabled ? 'Parar música 8-bit' : 'Música de batalla 8-bit'}
            >
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">Música</span>
            </button>

            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {session.status === 'waiting' && (
              <button
                onClick={handleStartGame}
                disabled={playersList.length === 0}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-red-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-pokemon uppercase tracking-wider border-b-2 border-red-800"
              >
                <PokeballIcon className="w-5 h-5" />
                <span>¡Comenzar Batalla! ({playersList.length})</span>
              </button>
            )}

            {session.status === 'active' && (
              <button
                onClick={handleFinishGame}
                className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer font-pokemon uppercase"
              >
                <StopCircle className="w-4 h-4" />
                <span>Finalizar y Ver Podio</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Screen Content */}
      <main className="max-w-7xl w-full mx-auto p-4 md:p-8 flex-1 flex flex-col justify-center">
        {/* ==================== 1. WAITING LOBBY MODE ==================== */}
        {session.status === 'waiting' && (
          <div className="flex flex-col items-center justify-center my-auto py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-4xl w-full">
              {/* Instructions & Big PIN */}
              <div className="pokedex-shell border-2 border-red-400/50 rounded-[2rem] p-4 sm:p-5 text-center flex flex-col items-center justify-center shadow-2xl relative">
                <div className="w-full flex items-center justify-between pb-3 mb-3 border-b-2 border-red-950/60">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 border-2 border-white shadow-[0_0_10px_rgba(34,211,238,0.85)]" />
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="w-2 h-2 rounded-full bg-amber-300" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="text-[10px] font-pixel text-amber-200 uppercase tracking-widest">
                    CÓDIGO DE COMBATE
                  </span>
                </div>

                <div className="pokedex-screen w-full rounded-2xl p-5 flex flex-col items-center">
                  <h2 className="text-sm sm:text-base text-sky-200 font-semibold mb-2">
                    Entra desde tu tablet/móvil y pon el PIN:
                  </h2>

                  <div className="bg-slate-950 border-2 border-amber-400 rounded-2xl px-8 py-4 my-2 shadow-inner">
                    <span className="text-5xl md:text-6xl font-black tracking-widest text-amber-400 font-pokemon">
                      {session.pin}
                    </span>
                  </div>

                  <button
                    onClick={copyJoinLink}
                    className="mt-3 text-xs text-sky-300 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? '¡Enlace de combate copiado!' : 'Copiar enlace directo de invitación'}</span>
                  </button>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="bg-slate-900/90 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center shadow-2xl text-center">
                <span className="text-[11px] font-pixel text-slate-300 uppercase tracking-wider mb-3">
                  ESCANEADO RÁPIDO CON LA CÁMARA
                </span>

                {qrDataUrl ? (
                  <div className="p-3 bg-white rounded-2xl shadow-xl">
                    <img src={qrDataUrl} alt="Código QR para unirse" className="w-48 h-48 md:w-56 md:h-56" />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-slate-800 animate-pulse rounded-2xl" />
                )}

                <span className="text-xs text-amber-300 mt-4 font-bold flex items-center gap-1 font-pokemon">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Cada entrenador elige a su Pokémon y responde a su ritmo
                </span>
              </div>
            </div>

            {/* Lobby Game Rules Toggles */}
            <div className="w-full max-w-4xl mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <button
                type="button"
                onClick={() => setLobbySettings(s => ({ ...s, shuffleQuestions: !s.shuffleQuestions }))}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  lobbySettings.shuffleQuestions
                    ? 'bg-amber-400/15 border-amber-400 text-amber-200'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Shuffle className="w-4 h-4 shrink-0 text-amber-400" />
                <div>
                  <span className="text-xs font-black block font-pokemon">Barajar Preguntas</span>
                  <span className="text-[10px] opacity-80">{lobbySettings.shuffleQuestions ? 'Activado (anti-copia)' : 'Orden original'}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLobbySettings(s => ({ ...s, shuffleOptions: !s.shuffleOptions }))}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  lobbySettings.shuffleOptions
                    ? 'bg-amber-400/15 border-amber-400 text-amber-200'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                <div>
                  <span className="text-xs font-black block font-pokemon">Barajar Opciones</span>
                  <span className="text-[10px] opacity-80">{lobbySettings.shuffleOptions ? 'Activado' : 'Orden fijo'}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLobbySettings(s => ({ ...s, powerUpsEnabled: !s.powerUpsEnabled }))}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  lobbySettings.powerUpsEnabled
                    ? 'bg-emerald-500/15 border-emerald-400 text-emerald-200'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Zap className="w-4 h-4 shrink-0 text-emerald-400" />
                <div>
                  <span className="text-xs font-black block font-pokemon">Comodines (50/50)</span>
                  <span className="text-[10px] opacity-80">{lobbySettings.powerUpsEnabled ? 'Mochila activa' : 'Desactivados'}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLobbySettings(s => ({ ...s, showExplanations: !s.showExplanations }))}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  lobbySettings.showExplanations
                    ? 'bg-sky-500/15 border-sky-400 text-sky-200'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-sky-400" />
                <div>
                  <span className="text-xs font-black block font-pokemon">Explicaciones</span>
                  <span className="text-[10px] opacity-80">{lobbySettings.showExplanations ? 'Mostrar tras responder' : 'Ocultas'}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLobbySettings(s => ({ ...s, pvpAttacksEnabled: !s.pvpAttacksEnabled }))}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  lobbySettings.pvpAttacksEnabled
                    ? 'bg-red-500/20 border-red-400 text-red-200'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Flame className="w-4 h-4 shrink-0 text-red-400" />
                <div>
                  <span className="text-xs font-black block font-pokemon">Ataques PvP</span>
                  <span className="text-[10px] opacity-80">{lobbySettings.pvpAttacksEnabled ? 'Paralizar / -5s' : 'Desactivados'}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLobbySettings(s => ({ ...s, teamsEnabled: !s.teamsEnabled }))}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  lobbySettings.teamsEnabled
                    ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Users className="w-4 h-4 shrink-0 text-indigo-400" />
                <div>
                  <span className="text-xs font-black block font-pokemon">Equipos Región</span>
                  <span className="text-[10px] opacity-80">{lobbySettings.teamsEnabled ? 'Kanto/Johto/Hoenn/Sinnoh' : 'Individual'}</span>
                </div>
              </button>
            </div>

            {/* Pace Mode & Question Timer Controls */}
            <div className="w-full max-w-4xl mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-black text-white block font-pokemon">Ritmo de la Partida</span>
                  <span className="text-[10px] text-slate-400">
                    {lobbySettings.paceMode === 'teacher'
                      ? 'Todos avanzan cuando tú pulses Siguiente'
                      : 'Cada alumno avanza a su propio ritmo'}
                  </span>
                </div>
                <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 shrink-0">
                  <button
                    type="button"
                    onClick={() => setLobbySettings(s => ({ ...s, paceMode: 'free' }))}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black font-pokemon cursor-pointer transition-all ${
                      lobbySettings.paceMode !== 'teacher'
                        ? 'bg-amber-400 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚡ Libre
                  </button>
                  <button
                    type="button"
                    onClick={() => setLobbySettings(s => ({ ...s, paceMode: 'teacher' }))}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black font-pokemon cursor-pointer transition-all ${
                      lobbySettings.paceMode === 'teacher'
                        ? 'bg-emerald-400 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    👨‍🏫 Al ritmo del profe
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-black text-white block font-pokemon">Tiempo por Pregunta</span>
                  <span className="text-[10px] text-slate-400">Recomendado 30s o 45s para 4.º Primaria</span>
                </div>
                <select
                  value={lobbySettings.questionDuration ?? 30}
                  onChange={(e) => setLobbySettings(s => ({ ...s, questionDuration: Number(e.target.value) }))}
                  className="bg-slate-950 border border-amber-400/50 text-amber-300 text-xs font-black rounded-xl px-2.5 py-1.5 font-pokemon focus:outline-none cursor-pointer"
                >
                  <option value={20}>20s (Rápido)</option>
                  <option value={30}>30s (4º Primaria)</option>
                  <option value={45}>45s (Tranquilo)</option>
                  <option value={60}>60s (Amplio)</option>
                  <option value={-1}>∞ Sin límite</option>
                </select>
              </div>
            </div>

            {/* Players Joined Counter & Avatars list */}
            <div className="w-full max-w-4xl mt-6">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span className="text-base font-black text-white font-pokemon uppercase">
                    Entrenadores en la Arena ({playersList.length})
                  </span>
                </div>
                {playersList.length === 0 ? (
                  <span className="text-xs text-amber-400 animate-pulse font-bold font-pokemon">
                    Esperando a los contrincantes...
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">
                    Pasa el ratón sobre un alumno para expulsarlo si es necesario
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 justify-center min-h-[110px] p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
                {playersList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-slate-500 py-6">
                    <p className="text-xs font-pokemon">Nadie se ha unido todavía. Muestra el código en el proyector.</p>
                  </div>
                ) : (
                  playersList.map((player) => (
                    <div
                      key={player.id}
                      className="px-3.5 py-2 rounded-2xl bg-slate-900 border-2 border-slate-700/80 text-white font-bold text-xs flex items-center gap-2.5 shadow-md animate-in zoom-in-90 duration-200 relative group"
                    >
                      {player.avatar.startsWith('http') ? (
                        <img src={player.avatar} alt={player.nickname} className="w-7 h-7 object-contain drop-shadow" />
                      ) : (
                        <span className="text-xl">{player.avatar}</span>
                      )}
                      <span className="font-pokemon">{player.nickname}</span>

                      {/* Kick player mini button */}
                      <button
                        onClick={() => handleKickPlayer(player.id, player.nickname)}
                        title="Expulsar de la sala"
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. LIVE ACTIVE GAME MODE ==================== */}
        {session.status === 'active' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border-2 border-red-600/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-amber-400 flex items-center justify-center font-black text-xl font-pokemon border border-red-500/30">
                  {finishedCount}/{playersList.length}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white font-pokemon uppercase">Progreso del Combate</h3>
                  <p className="text-xs text-slate-400">
                    {playersList.length > 0 && finishedCount === playersList.length
                      ? '🎉 ¡Todos los entrenadores han terminado! Ya puedes mostrar el Podio.'
                      : `${finishedCount} entrenador${finishedCount !== 1 ? 'es' : ''} ha${finishedCount !== 1 ? 'n' : ''} superado todas las preguntas`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  disabled={controlLoading}
                  onClick={() => handleControlGame('add_time')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-pokemon flex items-center gap-1.5 shadow cursor-pointer active:scale-95 transition-transform"
                  title="Añadir 15 segundos extra al reloj actual de toda la clase"
                >
                  <Clock className="w-4 h-4" />
                  <span>+15s a toda la clase</span>
                </button>
                <span className="text-xs text-slate-400 font-pokemon">PIN:</span>
                <span className="font-mono font-black text-amber-400 text-lg bg-slate-950 px-3 py-1 rounded-xl border border-amber-400/40 font-pokemon">
                  {session.pin}
                </span>
              </div>
            </div>

            {/* Teacher-Paced Live Control Card */}
            {session.settings?.paceMode === 'teacher' && (() => {
              const tIdx = session.teacherCurrentIndex ?? 0;
              const activeQ = session.questions[tIdx];
              const answeredCurrentCount = activeQ
                ? playersList.filter((p) => p.answers.some((a) => a.questionId === activeQ.id)).length
                : 0;
              const isLastQ = tIdx + 1 >= session.questions.length;

              return (
                <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-sky-950/70 border-2 border-emerald-400/60 rounded-2xl p-4 shadow-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-400 text-slate-950 font-black text-xs font-pokemon">
                        PREGUNTA {tIdx + 1} / {session.questions.length}
                      </span>
                      <span className="text-xs font-bold text-emerald-200 font-pokemon">
                        Han respondido: {answeredCurrentCount} / {playersList.length}
                      </span>
                      {session.questionClosed && (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-400 text-red-300 text-[10px] font-pixel">
                          CERRADA
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!session.questionClosed && (
                        <button
                          type="button"
                          disabled={controlLoading}
                          onClick={() => handleControlGame('close_question')}
                          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs font-pokemon cursor-pointer active:scale-95"
                        >
                          🔒 Cerrar Pregunta
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={controlLoading}
                        onClick={() => handleControlGame('next_question')}
                        className="px-4 py-1.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs font-pokemon cursor-pointer active:scale-95 flex items-center gap-1"
                      >
                        <span>{isLastQ ? '🏆 Finalizar y Ver Podio' : '➡️ Siguiente Pregunta'}</span>
                      </button>
                    </div>
                  </div>
                  {activeQ && (
                    <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-3">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <p className="text-base sm:text-xl font-black text-white font-pokemon flex-1 leading-snug">
                          {activeQ.text}
                        </p>
                        {activeQ.image && (
                          <img
                            src={activeQ.image}
                            alt="Pregunta proyectada"
                            className="max-h-28 w-auto object-contain rounded-xl border border-amber-400/30 bg-slate-900/70 p-1 shrink-0"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeQ.options.map((opt, oIdx) => {
                          const letter = ['A', 'B', 'C', 'D'][oIdx] || String(oIdx + 1);
                          const revealCorrect = session.questionClosed || (playersList.length > 0 && answeredCurrentCount >= playersList.length);
                          return (
                            <div
                              key={opt.id}
                              className={`px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold font-pokemon flex items-center gap-2 transition-all ${
                                revealCorrect && opt.isCorrect
                                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20'
                                  : revealCorrect
                                  ? 'bg-slate-900/60 border-slate-800 text-slate-500'
                                  : 'bg-slate-900 border-slate-700 text-slate-200'
                              }`}
                            >
                              <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 font-black shrink-0">
                                {letter}
                              </span>
                              <span className="flex-1">{opt.text}</span>
                              {revealCorrect && opt.isCorrect && <span>✅</span>}
                            </div>
                          );
                        })}
                      </div>
                      {(session.questionClosed || (playersList.length > 0 && answeredCurrentCount >= playersList.length)) && activeQ.explanation && (
                        <p className="text-xs text-amber-300/95 bg-amber-400/10 border border-amber-400/30 rounded-xl px-3 py-2 font-medium">
                          💡 {activeQ.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Stadium Weather Control Bar (Game Master) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CloudSun className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="text-xs font-black text-white uppercase font-pokemon block">
                    Clima de Estadio Pokémon (25s)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {session.activeWeather && session.activeWeather.expiresAt > Date.now()
                      ? `${WEATHER_CONFIG[session.activeWeather.type].label}: ${WEATHER_CONFIG[session.activeWeather.type].effectDesc}`
                      : 'Activa un evento climático sorpresa para toda la clase'}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {(['sunny', 'storm', 'shield', 'rain'] as WeatherType[]).map((wType) => (
                  <button
                    key={wType}
                    type="button"
                    disabled={weatherLoading}
                    onClick={() => handleActivateWeather(wType)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all active:scale-95 cursor-pointer font-pokemon"
                  >
                    {WEATHER_CONFIG[wType].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Region Teams Scoreboard (if Teams Mode enabled) */}
            {session.settings?.teamsEnabled && playersList.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['Kanto', 'Johto', 'Hoenn', 'Sinnoh'] as RegionTeam[]).map((tName) => {
                  const tInfo = REGION_TEAMS[tName];
                  const members = playersList.filter((p) => p.team === tName);
                  const teamScore = members.reduce((acc, p) => acc + p.score, 0);
                  return (
                    <div key={tName} className={`rounded-2xl border p-3 bg-slate-900/90 ${tInfo.badgeClass}`}>
                      <div className="flex items-center justify-between text-xs font-black font-pokemon">
                        <span>{tInfo.emoji} {tInfo.name}</span>
                        <span>{members.length} jug.</span>
                      </div>
                      <p className="text-xl font-black text-white font-pokemon mt-1">
                        {teamScore.toLocaleString()} <span className="text-[10px] font-pixel opacity-75">EXP</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Live PvP Clash Flash Banner on Projector */}
            {liveAttackFlash && (
              <div
                className={`animate-clash-pop rounded-2xl p-4 border-2 text-center shadow-2xl ${
                  liveAttackFlash.type === 'paralyze'
                    ? 'bg-gradient-to-r from-amber-500/30 via-yellow-400/25 to-amber-500/30 border-amber-300 text-amber-200 animate-electric'
                    : 'bg-gradient-to-r from-red-600/35 via-orange-500/30 to-red-600/35 border-orange-400 text-orange-100'
                }`}
              >
                <p className="text-base sm:text-lg font-black font-pokemon uppercase tracking-wide drop-shadow">
                  {liveAttackFlash.text}
                </p>
              </div>
            )}

            {/* Live PvP Battle Log Ticker */}
            {session.battleLog && session.battleLog.length > 0 && (
              <div className="bg-gradient-to-r from-red-950/70 via-slate-900/90 to-amber-950/60 border-2 border-amber-400/40 rounded-2xl p-3 shadow-lg">
                <div className="flex items-center gap-2 mb-1.5">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                  <span className="text-[10px] font-pixel text-amber-300 uppercase tracking-wider">
                    ÚLTIMOS ATAQUES EN LA ARENA
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {session.battleLog.slice(0, 3).map((entry) => (
                    <span
                      key={entry.id}
                      className={`text-xs font-bold px-3 py-1 rounded-xl border font-pokemon ${
                        entry.type === 'paralyze'
                          ? 'bg-amber-400/15 border-amber-400/40 text-amber-200'
                          : 'bg-red-500/15 border-red-400/40 text-red-200'
                      }`}
                    >
                      {entry.text}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2 font-pokemon uppercase">
                  <Swords className="w-5 h-5 text-amber-400" />
                  <span>Clasificación de Entrenadores en Vivo</span>
                </h3>
                <span className="text-[10px] font-pixel text-amber-400">EN DIRECTO</span>
              </div>

              <div className="divide-y divide-slate-800">
                {playersList.map((player, idx) => {
                  const correctCount = player.answers.filter(a => a.isCorrect).length;
                  const progressPct = Math.round((player.currentQuestionIndex / totalQuestions) * 100);

                  return (
                    <div
                      key={player.id}
                      className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black font-pokemon ${
                          idx === 0
                            ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-950'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {idx + 1}º
                        </span>

                        {player.avatar.startsWith('http') ? (
                          <img src={player.avatar} alt={player.nickname} className="w-10 h-10 object-contain drop-shadow" />
                        ) : (
                          <span className="text-2xl">{player.avatar}</span>
                        )}

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-white text-sm font-pokemon">{player.nickname}</span>
                            {player.team && REGION_TEAMS[player.team] && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border font-pokemon ${REGION_TEAMS[player.team].badgeClass}`}>
                                {REGION_TEAMS[player.team].emoji} {player.team}
                              </span>
                            )}
                            {player.streak >= 2 && (
                              <span className="flex items-center gap-0.5 text-[11px] font-black text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 font-pokemon">
                                <Flame className="w-3 h-3 fill-amber-400" />
                                {player.streak}
                              </span>
                            )}
                            {player.activeEffect && player.activeEffect.expiresAt > Date.now() && (
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-full border animate-pulse font-pokemon ${
                                  player.activeEffect.type === 'paralyze'
                                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                                    : 'bg-red-500/20 text-red-300 border-red-400/50'
                                }`}
                              >
                                {player.activeEffect.type === 'paralyze' ? '⚡ Paralizado' : '🔥 -5s'}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {correctCount} aciertos • {player.score} EXP
                          </span>
                        </div>
                      </div>

                      <div className="w-full sm:w-64 flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[11px] font-pokemon">
                          <span className="text-slate-400">Pregunta {player.currentQuestionIndex}/{totalQuestions}</span>
                          <span className={player.isFinished || player.answers.length >= totalQuestions ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                            {player.isFinished || player.answers.length >= totalQuestions ? 'Completado 🏅' : `${progressPct}%`}
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                          <div
                            className={`h-full transition-all duration-500 ${
                              player.isFinished ? 'hp-bar-green' : 'bg-gradient-to-r from-red-500 to-amber-400'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-right sm:min-w-[110px]">
                        <span className="text-xl font-black text-amber-300 font-pokemon">{player.score.toLocaleString()}</span>
                        <span className="text-[10px] block text-slate-400 font-pixel">EXP</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. FINISHED MODE (PODIUM & QUESTION REVIEW) ==================== */}
        {session.status === 'finished' && (
          <div className="flex flex-col items-center justify-center my-auto py-4">
            {/* View Switcher Tabs */}
            <div className="flex rounded-2xl bg-slate-900 border-2 border-slate-800 p-1 mb-6 font-pokemon">
              <button
                onClick={() => setFinishedTab('podium')}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                  finishedTab === 'podium'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Hall de la Fama</span>
              </button>
              <button
                onClick={() => setFinishedTab('analytics')}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                  finishedTab === 'analytics'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Análisis de Preguntas</span>
              </button>
              <button
                type="button"
                onClick={printTop3Diplomas}
                className="px-4 py-2 rounded-xl text-xs font-black text-emerald-300 hover:bg-emerald-500/15 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Diplomas Top 3</span>
              </button>
            </div>

            {/* TAB A: PODIUM */}
            {finishedTab === 'podium' && (
              <div className="w-full flex flex-col items-center">
                <span className="text-[11px] font-pixel text-amber-400 uppercase tracking-widest mb-1">
                  ¡LIGA POKÉMON FINALIZADA!
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-8 font-pokemon uppercase tracking-wide">
                  Hall de la Fama 🏆
                </h2>

                <div className="flex items-end justify-center gap-4 max-w-2xl w-full mb-10 px-4">
                  {/* 2nd Place */}
                  {playersList[1] && (
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-14 h-14 mb-1">
                        {playersList[1].avatar.startsWith('http') ? (
                          <img src={playersList[1].avatar} alt={playersList[1].nickname} className="w-full h-full object-contain drop-shadow" />
                        ) : (
                          <span className="text-3xl">{playersList[1].avatar}</span>
                        )}
                      </div>
                      <span className="text-sm font-black text-white truncate max-w-[110px] font-pokemon">{playersList[1].nickname}</span>
                      <span className="text-xs text-slate-400 mb-2 font-pokemon">{playersList[1].score.toLocaleString()} EXP</span>
                      <div className="w-full h-40 bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-3xl flex flex-col items-center justify-center border-t-4 border-slate-300 shadow-xl px-1.5 text-center">
                        <UltraBallIcon className="w-7 h-7 mb-0.5" />
                        <span className="text-xl font-black text-slate-300 font-pokemon leading-none">2º</span>
                        <div className="mt-1.5 flex flex-wrap justify-center gap-1">
                          {getRewardForRank(2)?.badges.map((b, i) => (
                            <span key={i} className="text-[9px] leading-tight font-bold bg-slate-900/80 text-sky-200 border border-slate-500/50 rounded-md px-1.5 py-0.5">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 1st Place */}
                  {playersList[0] && (
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-4xl mb-1 animate-bounce">👑</span>
                      <div className="w-20 h-20 mb-1">
                        {playersList[0].avatar.startsWith('http') ? (
                          <img src={playersList[0].avatar} alt={playersList[0].nickname} className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(251,191,36,0.5)]" />
                        ) : (
                          <span className="text-5xl">{playersList[0].avatar}</span>
                        )}
                      </div>
                      <span className="text-base font-black text-amber-300 truncate max-w-[130px] font-pokemon">{playersList[0].nickname}</span>
                      <span className="text-xs text-amber-200/90 font-black mb-2 font-pokemon">{playersList[0].score.toLocaleString()} EXP</span>
                      <div className="w-full h-56 bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-400 rounded-t-3xl flex flex-col items-center justify-center border-t-4 border-white shadow-2xl shadow-amber-500/40 px-2 text-center">
                        <PokeballIcon className="w-9 h-9 mb-0.5" />
                        <span className="text-3xl font-black text-white font-pokemon leading-none">1º</span>
                        <span className="text-[9px] font-pixel text-slate-950 uppercase font-black mt-0.5">CAMPEÓN</span>
                        <div className="mt-1.5 flex flex-wrap justify-center gap-1">
                          {getRewardForRank(1)?.badges.map((b, i) => (
                            <span key={i} className="text-[9px] leading-tight font-black bg-slate-950/85 text-amber-300 border border-amber-200/60 rounded-md px-1.5 py-0.5 shadow-sm">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {playersList[2] && (
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-14 h-14 mb-1">
                        {playersList[2].avatar.startsWith('http') ? (
                          <img src={playersList[2].avatar} alt={playersList[2].nickname} className="w-full h-full object-contain drop-shadow" />
                        ) : (
                          <span className="text-3xl">{playersList[2].avatar}</span>
                        )}
                      </div>
                      <span className="text-sm font-black text-white truncate max-w-[110px] font-pokemon">{playersList[2].nickname}</span>
                      <span className="text-xs text-slate-400 mb-2 font-pokemon">{playersList[2].score.toLocaleString()} EXP</span>
                      <div className="w-full h-32 bg-gradient-to-t from-amber-900 to-amber-800 rounded-t-3xl flex flex-col items-center justify-center border-t-4 border-amber-700 shadow-xl px-1.5 text-center">
                        <GreatBallIcon className="w-7 h-7 mb-0.5" />
                        <span className="text-xl font-black text-amber-400 font-pokemon leading-none">3º</span>
                        <div className="mt-1.5 flex flex-wrap justify-center gap-1">
                          {getRewardForRank(3)?.badges.map((b, i) => (
                            <span key={i} className="text-[9px] leading-tight font-bold bg-slate-950/75 text-amber-200 border border-amber-600/50 rounded-md px-1.5 py-0.5">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Full Class Standings Table (4th+ and all players summary) */}
                {playersList.length > 0 && (
                  <div className="w-full max-w-3xl bg-slate-900/90 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-xl mb-4">
                    <div className="px-5 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400 uppercase font-pokemon">
                        Clasificación Completa de la Clase ({playersList.length})
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Nota media: {(() => {
                          const avg = playersList.reduce((acc, p) => acc + ((p.answers.filter(a => a.isCorrect).length / (totalQuestions || 1)) * 10), 0) / playersList.length;
                          return avg.toFixed(1);
                        })()} / 10
                      </span>
                    </div>
                    <div className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto">
                      {playersList.map((p, idx) => {
                        const correct = p.answers.filter(a => a.isCorrect).length;
                        const pct = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
                        const reward = getRewardForRank(idx + 1);
                        return (
                          <div key={p.id} className="px-5 py-2.5 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3 min-w-0 flex-wrap">
                              <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black shrink-0 font-pokemon ${
                                idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : idx === 2 ? 'bg-amber-700 text-white' : idx < 6 ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {idx + 1}º
                              </span>
                              {p.avatar.startsWith('http') ? (
                                <img src={p.avatar} alt={p.nickname} className="w-7 h-7 object-contain shrink-0" />
                              ) : (
                                <span className="text-lg">{p.avatar}</span>
                              )}
                              <span className="font-black text-white truncate font-pokemon">{p.nickname}</span>
                              {reward && (
                                <div className="flex items-center gap-1 flex-wrap">
                                  {reward.badges.map((b, bIdx) => (
                                    <span
                                      key={bIdx}
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                        bIdx === 0
                                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                                          : bIdx === 1
                                          ? 'bg-red-500/15 text-red-300 border-red-500/40'
                                          : 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                                      }`}
                                    >
                                      {b}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                              <span className="text-slate-400 hidden sm:inline">
                                {correct}/{totalQuestions} ({pct}%)
                              </span>
                              <span className="font-black text-amber-300 font-pokemon min-w-[75px] text-right">
                                {p.score.toLocaleString()} EXP
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Official Top 6 League Rewards Reference Box */}
                <div className="w-full max-w-3xl bg-slate-900/80 border border-amber-500/30 rounded-3xl p-4 shadow-lg mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-amber-400 uppercase font-pokemon flex items-center gap-1.5">
                      <span>🎁</span> Cuadro Oficial de Premios de la Liga (Top 6)
                    </span>
                    <span className="text-[10px] text-slate-400 font-pixel">Entrega del Maestro/a al finalizar</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {Object.values(TOP_6_REWARDS).map((r) => (
                      <div key={r.rank} className="bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 font-pokemon ${
                          r.rank === 1 ? 'bg-amber-400 text-slate-950' : r.rank === 2 ? 'bg-slate-300 text-slate-950' : r.rank === 3 ? 'bg-amber-700 text-white' : 'bg-emerald-900/70 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {r.rank}º
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {r.badges.map((b, i) => (
                            <span key={i} className="text-[10px] font-bold text-slate-200 bg-slate-800/90 px-1.5 py-0.5 rounded-md">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB B: CLASSROOM QUESTION ANALYTICS */}
            {finishedTab === 'analytics' && (
              <div className="w-full max-w-4xl bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-white font-pokemon uppercase">
                      Rendimiento de la Clase por Pregunta
                    </h3>
                    <p className="text-xs text-slate-400">
                      Haz clic en cualquier pregunta para proyectarla y resolver dudas con los alumnos.
                    </p>
                  </div>
                  <span className="text-xs text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-xl font-pokemon">
                    {playersList.length} Alumnos evaluados
                  </span>
                </div>

                <div className="space-y-3">
                  {session.questions.map((q, idx) => {
                    // Count how many answered correctly
                    let correctCount = 0;
                    let totalAnswers = 0;

                    playersList.forEach(p => {
                      const ans = p.answers.find(a => a.questionId === q.id);
                      if (ans) {
                        totalAnswers++;
                        if (ans.isCorrect) correctCount++;
                      }
                    });

                    const accuracyPct = totalAnswers > 0 ? Math.round((correctCount / totalAnswers) * 100) : 0;
                    const isHard = accuracyPct < 50;

                    return (
                      <div
                        key={q.id}
                        onClick={() => setSelectedQuestionModal(idx)}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/60 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-xs font-pokemon">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors font-pokemon">
                              {q.text}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-slate-400">
                                {correctCount} de {totalAnswers} aciertos ({accuracyPct}%)
                              </span>
                              {isHard && totalAnswers > 0 && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 inline-flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Repasar en clase
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <div className="w-32 h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                            <div
                              className={`h-full ${accuracyPct >= 70 ? 'bg-emerald-500' : accuracyPct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${accuracyPct}%` }}
                            />
                          </div>
                          <span className={`text-xs font-black px-2 py-0.5 rounded-lg font-pokemon ${
                            accuracyPct >= 70 ? 'text-emerald-400 bg-emerald-500/10' : accuracyPct >= 40 ? 'text-amber-400 bg-amber-500/10' : 'text-red-400 bg-red-500/10'
                          }`}>
                            {accuracyPct}%
                          </span>
                          <Eye className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={downloadExcelReport}
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all font-pokemon uppercase tracking-wider flex items-center gap-2 cursor-pointer border-b-2 border-emerald-800"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Excel (.xls) de la Batalla</span>
              </button>

              <Link
                href="/teacher"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all font-pokemon uppercase tracking-wider border-b-2 border-red-800"
              >
                Volver al Laboratorio del Docente
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* QUESTION PROJECTION MODAL FOR TEACHER */}
      {selectedQuestionModal !== null && session && session.questions[selectedQuestionModal] && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedQuestionModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-pixel text-amber-400 uppercase tracking-widest block mb-2">
              REPASO EN LA PIZARRA • PREGUNTA {selectedQuestionModal + 1}
            </span>

            <h3 className="text-xl font-black text-white font-pokemon mb-4">
              {session.questions[selectedQuestionModal].text}
            </h3>

            {session.questions[selectedQuestionModal].image && (
              <div className="rounded-2xl overflow-hidden max-h-64 flex items-center justify-center bg-black/40 border border-slate-800 mb-4 p-2">
                <img
                  src={session.questions[selectedQuestionModal].image}
                  alt="Pregunta"
                  className="max-h-60 object-contain drop-shadow"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-4">
              {session.questions[selectedQuestionModal].options.map((opt, i) => (
                <div
                  key={opt.id}
                  className={`p-3 rounded-xl border-2 flex items-center gap-2 font-pokemon text-sm ${
                    opt.isCorrect
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  {opt.isCorrect ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4" />}
                  <span className="font-bold">{opt.text}</span>
                </div>
              ))}
            </div>

            {session.questions[selectedQuestionModal].explanation && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300">
                <span className="text-amber-400 font-bold block mb-0.5">Explicación para la clase:</span>
                {session.questions[selectedQuestionModal].explanation}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
