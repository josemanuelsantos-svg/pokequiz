'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  Trophy, Users, Play, StopCircle, ArrowLeft, Sparkles, 
  Flame, CheckCircle, BarChart3, Clock, Share2, Volume2, VolumeX, 
  Music, Swords, Award, Zap, X, ChevronRight, HelpCircle, Eye, Download
} from 'lucide-react';
import { Session, Player } from '@/lib/types';
import { sounds } from '@/lib/sound';
import { PokeballIcon, GreatBallIcon, UltraBallIcon } from '@/components/Pokeball';

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

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setSoundEnabled(next);
  };

  const toggleMusic = () => {
    const active = sounds.toggleMusic();
    setMusicEnabled(active);
  };

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
      const res = await fetch(`/api/sessions/${pin}/start`, { method: 'POST' });
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

  const downloadCSVReport = () => {
    if (!session) return;
    const header = ['Posición', 'Nombre Alumno', 'Puntuación EXP', 'Aciertos', 'Total Preguntas', 'Porcentaje', 'Nota sobre 10', 'Mejor Racha'];
    const rows = playersList.map((p, idx) => {
      const correct = p.answers.filter(a => a.isCorrect).length;
      const pct = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
      const grade = ((correct / (totalQuestions || 1)) * 10).toFixed(1);
      return [
        idx + 1,
        `"${p.nickname.replace(/"/g, '""')}"`,
        p.score,
        correct,
        totalQuestions,
        `${pct}%`,
        grade,
        p.highestStreak
      ];
    });

    const csvContent = '\uFEFF' + [header.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Calificaciones_${session.quizTitle.replace(/\s+/g, '_')}_PIN_${session.pin}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
              <div className="bg-slate-900/90 border-2 border-red-600/60 rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center justify-center shadow-2xl relative">
                <div className="flex items-center gap-2 mb-2">
                  <PokeballIcon className="w-5 h-5" />
                  <span className="text-[11px] font-pixel text-amber-400 uppercase tracking-widest">
                    CÓDIGO DE COMBATE
                  </span>
                </div>
                
                <h2 className="text-sm sm:text-base text-slate-300 font-semibold mb-2">
                  Entra desde el móvil y pon el PIN:
                </h2>

                <div className="bg-slate-950 border-2 border-amber-400 rounded-2xl px-8 py-5 my-2 shadow-inner">
                  <span className="text-5xl md:text-6xl font-black tracking-widest text-amber-400 font-pokemon">
                    {session.pin}
                  </span>
                </div>

                <button
                  onClick={copyJoinLink}
                  className="mt-3 text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? '¡Enlace de combate copiado!' : 'Copiar enlace directo de invitación'}</span>
                </button>
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

            {/* Players Joined Counter & Avatars list */}
            <div className="w-full max-w-4xl mt-8">
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
                    {finishedCount} entrenador{finishedCount !== 1 ? 'es' : ''} ha{finishedCount !== 1 ? 'n' : ''} superado todas las preguntas
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-pokemon">PIN DE COMBATE:</span>
                <span className="font-mono font-black text-amber-400 text-lg bg-slate-950 px-3 py-1 rounded-xl border border-amber-400/40 font-pokemon">
                  {session.pin}
                </span>
              </div>
            </div>

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
                          <div className="flex items-center gap-2">
                            <span className="font-black text-white text-sm font-pokemon">{player.nickname}</span>
                            {player.streak >= 2 && (
                              <span className="flex items-center gap-0.5 text-[11px] font-black text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 font-pokemon">
                                <Flame className="w-3 h-3 fill-amber-400" />
                                {player.streak}
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
                          <span className={player.isFinished ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                            {player.isFinished ? 'Completado 🏅' : `${progressPct}%`}
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
                      <div className="w-full h-36 bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-3xl flex flex-col items-center justify-center border-t-4 border-slate-300 shadow-xl">
                        <UltraBallIcon className="w-8 h-8 mb-1" />
                        <span className="text-2xl font-black text-slate-300 font-pokemon">2º</span>
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
                      <div className="w-full h-52 bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-400 rounded-t-3xl flex flex-col items-center justify-center border-t-4 border-white shadow-2xl shadow-amber-500/40">
                        <PokeballIcon className="w-10 h-10 mb-1" />
                        <span className="text-4xl font-black text-white font-pokemon">1º</span>
                        <span className="text-[10px] font-pixel text-slate-950 uppercase font-black">CAMPEÓN</span>
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
                      <div className="w-full h-28 bg-gradient-to-t from-amber-900 to-amber-800 rounded-t-3xl flex flex-col items-center justify-center border-t-4 border-amber-700 shadow-xl">
                        <GreatBallIcon className="w-7 h-7 mb-1" />
                        <span className="text-2xl font-black text-amber-400 font-pokemon">3º</span>
                      </div>
                    </div>
                  )}
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
                            <span className="text-[11px] text-slate-400">
                              {correctCount} de {totalAnswers} aciertos ({accuracyPct}%)
                            </span>
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
                onClick={downloadCSVReport}
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all font-pokemon uppercase tracking-wider flex items-center gap-2 cursor-pointer border-b-2 border-emerald-800"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Calificaciones (Excel / CSV)</span>
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
