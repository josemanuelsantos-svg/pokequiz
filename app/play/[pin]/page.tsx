'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { 
  Flame, Check, X, ArrowRight, Trophy, Sparkles, 
  Volume2, VolumeX, Music, Zap, Shield, Swords, HelpCircle, ChevronDown, ChevronUp, Dices, Hourglass, Coins
} from 'lucide-react';
import { Session, Player } from '@/lib/types';
import { sounds } from '@/lib/sound';
import { POKEMON_AVATARS, PokemonAvatar } from '@/lib/pokemon-avatars';
import { PokeballIcon } from '@/components/Pokeball';

export default function StudentPlayPage({ params }: { params: Promise<{ pin: string }> }) {
  const { pin } = use(params);

  // Connection & Player state
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [playerId, setPlayerId] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<PokemonAvatar>(POKEMON_AVATARS[0]);
  const [joining, setJoining] = useState(false);

  // Gameplay state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answering, setAnswering] = useState(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    scoreEarned: number;
    correctOptionId?: string;
    explanation?: string;
    totalScore: number;
    streak: number;
  } | null>(null);

  // Timer
  const [timeLeft, setTimeLeft] = useState(20);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio controls
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);

  // Review expanded state
  const [showReview, setShowReview] = useState(true);

  // Power-ups (Mochila de Entrenador)
  const [powerUps, setPowerUps] = useState({
    fiftyFifty: true,
    extraTime: true,
    doubleExp: true
  });
  const [hiddenOptionIds, setHiddenOptionIds] = useState<string[]>([]);
  const [isDoubleExpActive, setIsDoubleExpActive] = useState(false);

  const handleRandomNickname = () => {
    const prefixes = ['Pikachu', 'Charizard', 'Gengar', 'Eevee', 'Lucario', 'Mewtwo', 'Blastoise', 'Snorlax', 'Rayquaza'];
    const suffixes = ['Pro', 'Master', 'Veloz', 'Crack', 'Feroz', 'Sabio', 'Titan', 'Star'];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    const num = Math.floor(10 + Math.random() * 89);
    setNickname(`${p}_${s}${num}`);
    sounds.playClick();
  };

  const useFiftyFifty = () => {
    if (!powerUps.fiftyFifty || !session) return;
    const currentQ = session.questions[currentIdx];
    if (!currentQ || currentQ.options.length <= 2) return;

    sounds.playClick();
    const wrongOptions = currentQ.options.filter(o => !o.isCorrect).map(o => o.id);
    // Shuffle wrong options and pick 2 to hide
    const toHide = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
    setHiddenOptionIds(toHide);
    setPowerUps(prev => ({ ...prev, fiftyFifty: false }));
  };

  const useExtraTime = () => {
    if (!powerUps.extraTime) return;
    sounds.playClick();
    setTimeLeft(prev => prev + 15);
    setPowerUps(prev => ({ ...prev, extraTime: false }));
  };

  const useDoubleExp = () => {
    if (!powerUps.doubleExp) return;
    sounds.playClick();
    setIsDoubleExpActive(true);
    setPowerUps(prev => ({ ...prev, doubleExp: false }));
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setSoundEnabled(next);
  };

  const toggleMusic = () => {
    const active = sounds.toggleMusic();
    setMusicEnabled(active);
  };

  // Restore saved player session on mount / reload
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPlayerId = sessionStorage.getItem(`pokequiz_${pin}_player`);
      if (savedPlayerId) {
        setPlayerId(savedPlayerId);
      }
    }
  }, [pin]);

  // Clean up BGM on unmount
  useEffect(() => {
    return () => {
      sounds.stopMusic();
    };
  }, []);

  // Poll session state
  const fetchSession = async () => {
    try {
      const res = await fetch(`/api/sessions/${pin}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSession(data.data);

        // If player is already joined, sync current question index or detect if kicked
        if (playerId && data.data.players) {
          const p: Player | undefined = data.data.players[playerId];
          if (!p) {
            // Player was kicked by host or session reset
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem(`pokequiz_${pin}_player`);
            }
            setPlayerId(null);
            setFeedback(null);
            setCurrentIdx(0);
          } else if (!feedback && currentIdx < p.currentQuestionIndex) {
            setCurrentIdx(p.currentQuestionIndex);
          }
        }
      } else {
        setError(data.error || 'Gimnasio no encontrado');
      }
    } catch {
      setError('Error al conectar con el Gimnasio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
    const interval = setInterval(fetchSession, 1800);
    return () => clearInterval(interval);
  }, [pin, playerId, feedback, currentIdx]);

  // Setup question timer
  useEffect(() => {
    if (!session || session.status !== 'active' || !playerId || feedback) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const currentQuestion = session.questions[currentIdx];
    if (!currentQuestion) return;

    setTimeLeft(currentQuestion.timeLimit || 20);
    setQuestionStartTime(Date.now());

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session?.status, currentIdx, playerId, feedback]);

  // Trigger timeout submission cleanly when timeLeft hits 0
  useEffect(() => {
    if (timeLeft === 0 && session?.status === 'active' && playerId && !feedback && !answering) {
      if (timerRef.current) clearInterval(timerRef.current);
      submitAnswer('');
    }
  }, [timeLeft, session?.status, playerId, feedback, answering]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    try {
      setJoining(true);
      const res = await fetch(`/api/sessions/${pin}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim(),
          avatar: selectedAvatar.artwork
        })
      });
      const data = await res.json();
      if (data.success && data.data?.playerId) {
        const id = data.data.playerId;
        setPlayerId(id);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`pokequiz_${pin}_player`, id);
        }
        sounds.playClick();
      } else {
        alert(data.error || 'No se pudo unir al Gimnasio');
      }
    } catch {
      alert('Error de conexión');
    } finally {
      setJoining(false);
    }
  };

  const submitAnswer = async (optionId: string) => {
    if (answering || feedback || !session || !playerId) return;

    const currentQuestion = session.questions[currentIdx];
    if (!currentQuestion) return;

    setAnswering(true);
    setSelectedOptionId(optionId);

    const timeSpent = Math.max(0.5, (Date.now() - questionStartTime) / 1000);

    try {
      const res = await fetch(`/api/sessions/${pin}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          questionId: currentQuestion.id,
          selectedOptionId: optionId,
          timeSpent,
          doubleExp: isDoubleExpActive
        })
      });

      const data = await res.json();
      if (data.success) {
        setFeedback(data.data);
        if (data.data.isCorrect) {
          sounds.playCorrect();
        } else {
          sounds.playIncorrect();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnswering(false);
    }
  };

  const handleNextQuestion = () => {
    if (!session) return;
    sounds.playClick();
    setFeedback(null);
    setSelectedOptionId(null);
    setHiddenOptionIds([]);
    setIsDoubleExpActive(false);
    setCurrentIdx(prev => prev + 1);
  };

  const myPlayer: Player | undefined = playerId && session?.players ? session.players[playerId] : undefined;
  const isFinished = !feedback && Boolean(myPlayer?.isFinished || (session?.questions && currentIdx >= session.questions.length));

  useEffect(() => {
    if (isFinished) {
      sounds.playFanfare();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 }
      });
    }
  }, [isFinished]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pokemon-pattern flex flex-col items-center justify-center p-4">
        <PokeballIcon className="w-12 h-12" spinning={true} />
        <p className="text-amber-300 font-pokemon text-sm mt-4">Conectando con el Gimnasio #{pin}...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-pokemon-pattern flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center mb-4 border border-red-500/40">
          <X className="w-8 h-8 stroke-[3]" />
        </div>
        <h2 className="text-2xl font-black text-white font-pokemon mb-2">{error || 'Gimnasio no encontrado'}</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-sm">
          Comprueba el código #{pin} con tu profesor.
        </p>
        <Link href="/" className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm font-pokemon shadow-lg shadow-red-600/30">
          Volver a la Portada
        </Link>
      </div>
    );
  }

  const attackStyles = [
    {
      bg: 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border-red-900',
      type: 'FUEGO',
      icon: '🔥'
    },
    {
      bg: 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 border-blue-900',
      type: 'AGUA',
      icon: '💧'
    },
    {
      bg: 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 border-amber-800 text-slate-950',
      type: 'ELÉCTRICO',
      icon: '⚡'
    },
    {
      bg: 'bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 border-emerald-900',
      type: 'PLANTA',
      icon: '🍃'
    },
  ];

  return (
    <div className="min-h-screen bg-pokemon-pattern text-slate-100 flex flex-col justify-between p-3 sm:p-6 select-none relative overflow-hidden">
      {/* Audio controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={toggleMusic}
          className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
            musicEnabled ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900/80 text-slate-400 border-slate-700'
          }`}
          title={musicEnabled ? 'Parar música 8-bit' : 'Música de batalla 8-bit'}
        >
          <Music className="w-4 h-4" />
          <span className="hidden sm:inline">Música</span>
        </button>

        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white"
          title={soundEnabled ? 'Silenciar efectos' : 'Activar efectos'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>
      </div>

      {/* ================= STEP 1: JOIN FORM ================= */}
      {!playerId && (
        <div className="max-w-md w-full mx-auto my-auto py-4 relative z-10">
          <div className="text-center mb-4">
            <span className="text-[11px] font-pixel text-amber-400 uppercase tracking-widest">
              LIGA DE GIMNASIO • SALA #{pin}
            </span>
            <h1 className="text-2xl font-black text-white font-pokemon uppercase mt-1">
              {session.quizTitle}
            </h1>
          </div>

          <form onSubmit={handleJoin} className="bg-slate-900/90 border-2 border-red-600/60 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 shadow-red-950/40">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 text-center font-pokemon">
                Elige tu Pokémon Compañero
              </label>
              
              <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1 bg-slate-950/60 rounded-2xl border border-slate-800">
                {POKEMON_AVATARS.map((pk) => {
                  const isSelected = selectedAvatar.id === pk.id;
                  return (
                    <button
                      key={pk.id}
                      type="button"
                      onClick={() => setSelectedAvatar(pk)}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-gradient-to-t from-red-600/40 to-amber-500/20 border-2 border-amber-400 scale-105 shadow-md shadow-amber-400/20'
                          : 'bg-slate-900/80 border border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <img
                        src={pk.artwork}
                        alt={pk.name}
                        className="w-12 h-12 object-contain drop-shadow"
                      />
                      <span className="text-[10px] font-bold text-white mt-1 truncate max-w-full font-pokemon">
                        {pk.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-pokemon">
                  Nombre de Entrenador
                </label>
                <button
                  type="button"
                  onClick={handleRandomNickname}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 font-pokemon"
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>Aleatorio</span>
                </button>
              </div>
              <input
                type="text"
                maxLength={18}
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Ej. Ash Ketchum"
                className="w-full text-center text-lg font-bold py-3 bg-slate-950 border-2 border-amber-400/60 rounded-xl text-amber-300 placeholder-slate-700 focus:outline-none focus:border-amber-400 font-pokemon transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={joining || !nickname.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-base shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50 font-pokemon uppercase tracking-wider border-b-4 border-red-800"
            >
              {joining ? (
                <PokeballIcon className="w-5 h-5" spinning={true} />
              ) : (
                <>
                  <PokeballIcon className="w-5 h-5" />
                  <span>¡Iniciar Desafío!</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ================= STEP 2: WAITING LOBBY ================= */}
      {playerId && session.status === 'waiting' && (
        <div className="max-w-md w-full mx-auto my-auto text-center py-8 relative z-10">
          <div className="w-32 h-32 mx-auto mb-4 relative">
            <img
              src={myPlayer?.avatar || selectedAvatar.artwork}
              alt="Avatar"
              className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(251,191,36,0.3)] animate-float"
            />
            <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-700 p-1.5 rounded-full shadow">
              <PokeballIcon className="w-6 h-6 animate-spin [animation-duration:3s]" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-white font-pokemon uppercase">
            ¡Preparado, Entrenador {myPlayer?.nickname || nickname}!
          </h2>
          <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
            Tu Pokémon está listo para el combate.
          </p>

          <div className="mt-6 p-4 bg-slate-900/90 border border-amber-400/40 rounded-2xl flex items-center justify-center gap-2 text-amber-300 text-xs font-bold animate-pulse font-pokemon">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>Esperando a que el Líder de Gimnasio inicie el combate...</span>
          </div>
        </div>
      )}

      {/* ================= STEP 3: POKEMON BATTLE / QUESTION SCREEN ================= */}
      {playerId && session.status === 'active' && !isFinished && (
        <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col justify-between relative z-10">
          <div>
            <div className="flex items-center justify-between pb-2 text-xs font-pokemon">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="font-bold text-slate-300">
                  RONDA <span className="text-amber-400 font-black">{currentIdx + 1}</span> DE {session.questions.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {myPlayer && myPlayer.streak >= 2 && (
                  <span className="flex items-center gap-1 text-amber-400 font-black bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30 text-[11px]">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    ¡CRÍTICO x{myPlayer.streak}!
                  </span>
                )}
                <span className="text-amber-300 font-black text-sm">
                  {feedback ? feedback.totalScore : myPlayer?.score || 0} EXP
                </span>
              </div>
            </div>

            {session.questions[currentIdx] && !feedback && (
              <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 mb-3">
                <div className="flex items-center justify-between text-[10px] font-pixel text-slate-400 px-1 mb-1">
                  <span>EXP / TIEMPO</span>
                  <span className={timeLeft <= 5 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="w-full h-3 rounded-lg bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-md transition-all duration-1000 ${
                      timeLeft <= 5 ? 'hp-bar-red' : timeLeft <= 10 ? 'hp-bar-yellow' : 'hp-bar-green'
                    }`}
                    style={{
                      width: `${Math.max(0, (timeLeft / (session.questions[currentIdx].timeLimit || 20)) * 100)}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {session.questions[currentIdx] && !feedback && (
            <div className="flex-1 flex flex-col justify-between py-1">
              <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-4 sm:p-5 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-2 right-3 opacity-10">
                  <PokeballIcon className="w-24 h-24" />
                </div>

                <h2 className="text-lg sm:text-2xl font-bold text-white leading-snug font-pokemon">
                  {session.questions[currentIdx].text}
                </h2>

                {session.questions[currentIdx].image && (
                  <div className="mt-3 rounded-2xl overflow-hidden max-h-52 sm:max-h-64 flex items-center justify-center bg-black/50 border border-slate-800 shadow-inner">
                    <img
                      src={session.questions[currentIdx].image}
                      alt="Ilustración de la pregunta"
                      className="max-h-52 sm:max-h-64 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Power-ups Bar (Mochila de Entrenador) */}
              <div className="flex items-center justify-between gap-2 px-1 py-1 mb-2">
                <span className="text-[10px] font-pixel text-slate-400">MOCHILA:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={useFiftyFifty}
                    disabled={!powerUps.fiftyFifty || session.questions[currentIdx].options.length <= 2}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1 border transition-all ${
                      powerUps.fiftyFifty
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 hover:bg-amber-400 hover:text-slate-950 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-600 line-through cursor-not-allowed'
                    }`}
                    title="Descarta 2 opciones incorrectas"
                  >
                    <Zap className="w-3 h-3 fill-amber-400" />
                    <span>50/50</span>
                  </button>

                  <button
                    type="button"
                    onClick={useExtraTime}
                    disabled={!powerUps.extraTime}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1 border transition-all ${
                      powerUps.extraTime
                        ? 'bg-sky-400/20 border-sky-400 text-sky-300 hover:bg-sky-400 hover:text-slate-950 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-600 line-through cursor-not-allowed'
                    }`}
                    title="Añade +15 segundos a la pregunta"
                  >
                    <Hourglass className="w-3 h-3 text-sky-400" />
                    <span>+15s</span>
                  </button>

                  <button
                    type="button"
                    onClick={useDoubleExp}
                    disabled={!powerUps.doubleExp || isDoubleExpActive}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1 border transition-all ${
                      isDoubleExpActive
                        ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-md animate-pulse'
                        : powerUps.doubleExp
                        ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-slate-950 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-600 line-through cursor-not-allowed'
                    }`}
                    title="Duplica los puntos EXP si aciertas"
                  >
                    <Coins className="w-3 h-3 text-yellow-400" />
                    <span>{isDoubleExpActive ? '¡x2 ACTIVO!' : 'Doble EXP'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {session.questions[currentIdx].options.map((opt, optIdx) => {
                  const style = attackStyles[optIdx % attackStyles.length];
                  const isHidden = hiddenOptionIds.includes(opt.id);

                  if (isHidden) {
                    return (
                      <div
                        key={opt.id}
                        className="min-h-[70px] sm:min-h-[85px] p-3.5 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/60 flex items-center justify-center text-slate-600 font-pokemon text-xs line-through select-none"
                      >
                        ⚡ Ataque bloqueado (50/50)
                      </div>
                    );
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => submitAnswer(opt.id)}
                      disabled={answering}
                      className={`min-h-[70px] sm:min-h-[85px] p-3.5 rounded-2xl font-bold text-base sm:text-lg text-white shadow-lg border-b-4 transition-all flex items-center gap-3 active:scale-95 cursor-pointer disabled:opacity-50 ${style.bg}`}
                    >
                      <span className="w-9 h-9 rounded-xl bg-black/25 flex items-center justify-center text-lg shrink-0">
                        {style.icon}
                      </span>
                      <span className="text-left flex-1 leading-snug font-semibold">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {feedback && (
            <div className="flex-1 flex flex-col items-center justify-center text-center my-auto p-4 animate-in zoom-in-95 duration-200">
              <div className="relative mb-3">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 ${
                    feedback.isCorrect
                      ? 'bg-amber-400 border-yellow-200 text-slate-950 shadow-amber-400/40'
                      : 'bg-red-600 border-red-400 text-white shadow-red-600/40'
                  }`}
                >
                  {feedback.isCorrect ? '⚡' : '💥'}
                </div>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white mb-1 font-pokemon uppercase tracking-wider">
                {feedback.isCorrect ? '¡ES SÚPER EFECTIVO!' : '¡EL ATAQUE HA FALLADO!'}
              </h2>

              <p className="text-xl font-black text-amber-300 mb-2 font-pokemon">
                {feedback.isCorrect ? `+${feedback.scoreEarned} PUNTOS DE EXP` : '+0 EXP'}
              </p>

              {feedback.streak >= 2 && feedback.isCorrect && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black mb-3 font-pokemon">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>¡RACHA DE ATAQUES CRÍTICOS x{feedback.streak}!</span>
                </div>
              )}

              {!feedback.isCorrect && session.questions[currentIdx] && (
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl px-4 py-2 text-xs text-emerald-300 font-bold mb-3 font-pokemon">
                  Respuesta correcta: {session.questions[currentIdx].options.find(o => o.isCorrect)?.text}
                </div>
              )}

              {feedback.explanation && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs text-slate-300 max-w-md mx-auto mb-4 text-left">
                  <span className="text-amber-400 font-bold block mb-0.5 uppercase text-[10px] font-pixel">Datos de la Pokédex:</span>
                  {feedback.explanation}
                </div>
              )}

              <button
                onClick={handleNextQuestion}
                className="w-full max-w-sm py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-base shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer mt-2 font-pokemon uppercase tracking-wider border-b-4 border-red-800"
              >
                <span>{currentIdx + 1 >= session.questions.length ? 'Ver Hall de la Fama 🏆' : 'Siguiente Ataque'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= STEP 4: FINAL HALL OF FAME WITH RECAP ================= */}
      {playerId && (isFinished || session.status === 'finished') && (
        <div className="max-w-xl w-full mx-auto my-auto py-6 relative z-10 overflow-y-auto max-h-[90vh] pr-1">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-2">
              <img
                src={myPlayer?.avatar || selectedAvatar.artwork}
                alt="Avatar"
                className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(251,191,36,0.4)] animate-bounce"
              />
            </div>

            <span className="text-[10px] font-pixel text-amber-400 uppercase tracking-widest">
              ¡GIMNASIO CONQUISTADO!
            </span>
            <h2 className="text-3xl font-black text-white font-pokemon uppercase mt-0.5">
              ¡Hall de la Fama! 🏆
            </h2>
            <p className="text-slate-400 text-xs mt-1">Has superado todas las preguntas del combate.</p>
          </div>

          {/* Stats Card */}
          <div className="bg-slate-900/90 border-2 border-amber-400/60 rounded-3xl p-5 my-4 shadow-2xl space-y-3">
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-pixel">
                EXP Total Acumulada
              </span>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-500 to-pink-500 font-pokemon mt-1">
                {(myPlayer?.score || 0).toLocaleString()} EXP
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-pixel">Aciertos</span>
                <span className="text-lg font-black text-emerald-400 font-pokemon">
                  {myPlayer?.answers.filter(a => a.isCorrect).length || 0} / {session.questions.length}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-pixel">Mejor Racha</span>
                <span className="text-lg font-black text-amber-400 font-pokemon flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  {myPlayer?.highestStreak || 0}
                </span>
              </div>
            </div>
          </div>

          {/* RECAP ACCORDION: REVIEW ANSWERS */}
          {myPlayer && myPlayer.answers.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-lg mb-4">
              <button
                onClick={() => setShowReview(!showReview)}
                className="w-full flex items-center justify-between text-xs font-black text-amber-400 font-pokemon uppercase cursor-pointer"
              >
                <span>Revisión de tu Batalla ({myPlayer.answers.length} preguntas)</span>
                {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showReview && (
                <div className="mt-3 space-y-2.5 divide-y divide-slate-800/80 pt-1">
                  {session.questions.map((q, idx) => {
                    const ans = myPlayer.answers.find(a => a.questionId === q.id);
                    if (!ans) return null;
                    const selectedOpt = q.options.find(o => o.id === ans.selectedOptionId);
                    const correctOpt = q.options.find(o => o.isCorrect);

                    return (
                      <div key={q.id} className="pt-2.5 first:pt-0 text-left">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-white font-pokemon">
                            {idx + 1}. {q.text}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 font-pokemon ${
                            ans.isCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                          }`}>
                            {ans.isCorrect ? `+${ans.scoreEarned} EXP` : 'Fallo'}
                          </span>
                        </div>

                        <div className="mt-1 text-[11px] space-y-0.5 text-slate-300">
                          {!ans.isCorrect && selectedOpt && (
                            <p className="text-red-400 flex items-center gap-1">
                              <X className="w-3 h-3 shrink-0" />
                              <span>Tu ataque: {selectedOpt.text}</span>
                            </p>
                          )}
                          <p className="text-emerald-400 flex items-center gap-1 font-medium">
                            <Check className="w-3 h-3 shrink-0" />
                            <span>Respuesta correcta: {correctOpt?.text}</span>
                          </p>
                          {q.explanation && (
                            <p className="text-slate-400 text-[10px] italic pt-0.5">
                              {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-amber-300 font-bold font-pokemon animate-pulse">
              Mira la pantalla del Líder de Gimnasio para ver la entrega de medallas 🏅
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
