'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, use, useRef, useMemo } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { 
  Flame, Check, X, ArrowRight, Trophy, Sparkles, 
  Volume2, VolumeX, Music, Zap, Shield, Swords, HelpCircle, ChevronDown, ChevronUp, Dices, Hourglass, Coins, Home
} from 'lucide-react';
import { Session, Player, Question } from '@/lib/types';
import { sounds } from '@/lib/sound';
import { POKEMON_AVATARS, PokemonAvatar } from '@/lib/pokemon-avatars';
import { PokeballIcon } from '@/components/Pokeball';
import { getRewardForRank } from '@/lib/rewards';
import { AttackOverlay, AttackAnimationData } from '@/components/AttackOverlay';
import { REGION_TEAMS, WEATHER_CONFIG } from '@/lib/teams';

// Deterministic hash-based shuffle so each student gets a stable, unique order
function seededShuffle<T>(arr: T[], seedStr: string): T[] {
  const copy = [...arr];
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  for (let i = copy.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const GYM_OPPONENTS = [
  { name: 'Geodude', art: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/74.png' },
  { name: 'Starmie', art: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/121.png' },
  { name: 'Raichu', art: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png' },
  { name: 'Gengar', art: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png' },
  { name: 'Arcanine', art: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png' },
  { name: 'Alakazam', art: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png' },
  { name: 'Dragonite', art: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png' },
  { name: 'Mewtwo', art: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png' },
];

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

  // Audio controls (muted by default on student devices to keep classroom quiet)
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);

  useEffect(() => {
    sounds.setSoundEnabled(false);
  }, []);

  // Review expanded state
  const [showReview, setShowReview] = useState(true);

  // Power-ups (Mochila de Entrenador) - multiple charges for +15s and 50/50!
  const [powerUps, setPowerUps] = useState({
    fiftyFifty: 2,
    extraTime: 3,
    doubleExp: 1
  });
  const [hiddenOptionIds, setHiddenOptionIds] = useState<string[]>([]);
  const [isDoubleExpActive, setIsDoubleExpActive] = useState(false);

  // PvP Attack & Incoming Status Effects
  const processedEffectIdsRef = useRef<Set<string>>(new Set());
  const [paralyzedSec, setParalyzedSec] = useState<number>(0);
  const [incomingAlert, setIncomingAlert] = useState<{
    type: 'paralyze' | 'steal_time';
    fromNickname: string;
  } | null>(null);
  const [attackFeedback, setAttackFeedback] = useState<string | null>(null);
  const [launchingAttack, setLaunchingAttack] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [attackAnimation, setAttackAnimation] = useState<AttackAnimationData | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [paralysisTaps, setParalysisTaps] = useState<number>(0);
  const lastWeatherActivatedAtRef = useRef<number>(0);
  const lastBonusPulseAtRef = useRef<number>(0);
  const timerArmedRef = useRef<boolean>(false);

  const speakQuestion = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      const titleLower = (session?.quizTitle || '').toLowerCase();
      utter.lang = titleLower.includes('ingl') || titleLower.includes('english') ? 'en-GB' : 'es-ES';
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    } catch {
      // ignore if speech synthesis is blocked
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

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
    if (powerUps.fiftyFifty <= 0 || !currentQuestion) return;
    if (currentQuestion.options.length <= 2) return;

    sounds.playClick();
    const wrongOptions = currentQuestion.options.filter(o => !o.isCorrect).map(o => o.id);
    const hideCount = currentQuestion.options.length === 3 ? 1 : 2;
    const toHide = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, hideCount);
    setHiddenOptionIds(toHide);
    setPowerUps(prev => ({ ...prev, fiftyFifty: Math.max(0, prev.fiftyFifty - 1) }));
  };

  const useExtraTime = () => {
    if (powerUps.extraTime <= 0 || timeLeft < 0) return;
    sounds.playClick();
    setTimeLeft(prev => prev + 15);
    setPowerUps(prev => ({ ...prev, extraTime: Math.max(0, prev.extraTime - 1) }));
  };

  const useDoubleExp = () => {
    if (powerUps.doubleExp <= 0) return;
    sounds.playClick();
    setIsDoubleExpActive(true);
    setPowerUps(prev => ({ ...prev, doubleExp: Math.max(0, prev.doubleExp - 1) }));
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

          // Check for new incoming PvP attack effect
          if (
            p &&
            p.activeEffect &&
            p.activeEffect.expiresAt > Date.now() &&
            !processedEffectIdsRef.current.has(p.activeEffect.id)
          ) {
            processedEffectIdsRef.current.add(p.activeEffect.id);
            const eff = p.activeEffect;
            triggerShake();
            setIncomingAlert({ type: eff.type, fromNickname: eff.fromNickname });
            setAttackAnimation({
              mode: 'incoming',
              type: eff.type,
              attackerNickname: eff.fromNickname,
              attackerAvatar: eff.fromAvatar,
              targetNickname: p.nickname,
              targetAvatar: p.avatar,
            });
            setTimeout(() => setAttackAnimation(null), 2100);

            if (eff.type === 'paralyze') {
              sounds.playElectricZap();
              setParalysisTaps(0);
              setParalyzedSec(3);
            } else if (eff.type === 'steal_time') {
              sounds.playTimeDrain();
              setTimeLeft((prev) => Math.max(3, prev - 5));
            }

            setTimeout(() => {
              setIncomingAlert(null);
            }, 3500);
          }

          // Detect newly activated Stadium Weather (e.g. Rain gives +5s)
          const weather = data.data.activeWeather;
          if (
            weather &&
            weather.expiresAt > Date.now() &&
            weather.activatedAt > lastWeatherActivatedAtRef.current
          ) {
            lastWeatherActivatedAtRef.current = weather.activatedAt;
            if (weather.type === 'rain') {
              sounds.playCorrect();
              setTimeLeft((prev) => (prev >= 0 ? prev + 5 : prev));
            }
          }

          // Detect host "+15s extra" bonus time pulse
          const pulse = data.data.bonusTimePulse;
          if (pulse && pulse.createdAt > lastBonusPulseAtRef.current) {
            lastBonusPulseAtRef.current = pulse.createdAt;
            sounds.playCorrect();
            setTimeLeft((prev) => (prev >= 0 ? prev + pulse.seconds : prev));
          }

          // Sync with Teacher-Paced mode
          if (data.data.settings?.paceMode === 'teacher' && data.data.status === 'active') {
            const teacherIdx = data.data.teacherCurrentIndex ?? 0;
            if (teacherIdx > currentIdx) {
              timerArmedRef.current = false;
              setFeedback(null);
              setSelectedOptionId(null);
              setHiddenOptionIds([]);
              setIsDoubleExpActive(false);
              setParalyzedSec(0);
              setCurrentIdx(teacherIdx);
            } else if (data.data.questionClosed && !feedback && !answering) {
              timerArmedRef.current = false;
              submitAnswer('');
            }
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

  // Countdown for paralysis lock (3 seconds)
  useEffect(() => {
    if (paralyzedSec <= 0) return;
    const t = setTimeout(() => setParalyzedSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [paralyzedSec]);

  const handleLaunchAttack = async (attackType: 'paralyze' | 'steal_time') => {
    if (!playerId || launchingAttack) return;
    try {
      setLaunchingAttack(true);
      sounds.playClick();
      const res = await fetch(`/api/sessions/${pin}/attack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          attackType,
          targetPlayerId: selectedTargetId || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (attackType === 'paralyze') {
          sounds.playElectricZap();
        } else {
          sounds.playTimeDrain();
        }
        setAttackAnimation({
          mode: 'outgoing',
          type: attackType,
          attackerNickname: data.data.attackerNickname || myPlayer?.nickname || 'Tú',
          attackerAvatar: data.data.attackerAvatar || myPlayer?.avatar,
          targetNickname: data.data.targetNickname,
          targetAvatar: data.data.targetAvatar,
        });
        setTimeout(() => setAttackAnimation(null), 2000);
        const label =
          attackType === 'paralyze'
            ? `⚡ ¡Impactrueno sobre ${data.data.targetNickname}! (Paralizado 3s)`
            : `🔥 ¡Llama Temporal sobre ${data.data.targetNickname}! (-5s)`;
        setAttackFeedback(label);
        setSelectedTargetId('');
        setTimeout(() => setAttackFeedback(null), 3000);
        fetchSession();
      } else {
        setAttackFeedback(data.error || 'No se pudo lanzar el ataque');
        setTimeout(() => setAttackFeedback(null), 2500);
      }
    } catch {
      // ignore
    } finally {
      setLaunchingAttack(false);
    }
  };

  // Ordered questions & options per player (supports host shuffle settings)
  const orderedQuestions: Question[] = useMemo(() => {
    if (!session?.questions) return [];
    const baseQuestions = session.settings?.shuffleQuestions && playerId
      ? seededShuffle(session.questions, `${pin}-${playerId}-q`)
      : session.questions;

    if (session.settings?.shuffleOptions && playerId) {
      return baseQuestions.map((q) => ({
        ...q,
        options: seededShuffle(q.options, `${pin}-${playerId}-${q.id}-opt`),
      }));
    }
    return baseQuestions;
  }, [session?.questions, session?.settings?.shuffleQuestions, session?.settings?.shuffleOptions, playerId, pin]);

  const currentQuestion = orderedQuestions[currentIdx];

  const getQuestionDuration = (q?: Question): number => {
    if (!q) return 30;
    const override = session?.settings?.questionDuration;
    if (override === -1) return -1;
    if (override && override > 0) return override;
    return q.timeLimit || 30;
  };

  // Setup question timer cleanly without race conditions
  useEffect(() => {
    timerArmedRef.current = false;
    if (!session || session.status !== 'active' || !playerId || feedback) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (!currentQuestion) return;

    const duration = getQuestionDuration(currentQuestion);
    setTimeLeft(duration);
    setQuestionStartTime(Date.now());

    if (duration === -1) {
      // No time limit mode
      return;
    }

    timerArmedRef.current = true;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      timerArmedRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session?.status, currentIdx, playerId, feedback, currentQuestion?.id, session?.settings?.questionDuration]);

  // Trigger timeout submission cleanly ONLY when timer was armed for this question
  useEffect(() => {
    if (
      timerArmedRef.current &&
      timeLeft === 0 &&
      session?.status === 'active' &&
      playerId &&
      !feedback &&
      !answering
    ) {
      timerArmedRef.current = false;
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
          if (data.data.streak >= 2 && data.data.streak % 2 === 0) {
            sounds.playStreakBoost();
            confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
          } else {
            sounds.playCorrect();
          }
        } else {
          sounds.playIncorrect();
          triggerShake();
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
    timerArmedRef.current = false;
    const nextQ = orderedQuestions[currentIdx + 1];
    const nextDur = getQuestionDuration(nextQ);
    setTimeLeft(nextDur);
    setQuestionStartTime(Date.now());
    setSelectedOptionId(null);
    setHiddenOptionIds([]);
    setIsDoubleExpActive(false);
    setParalyzedSec(0);
    setCurrentIdx(prev => prev + 1);
    setFeedback(null);
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

          <form onSubmit={handleJoin} className="pokedex-shell rounded-[2rem] p-4 shadow-2xl border-2 border-red-400/50">
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-red-950/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 border-2 border-white shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[9px] font-pixel text-amber-200">REGISTRO DE LIGA</span>
            </div>

            <div className="pokedex-screen rounded-2xl p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-xs font-black text-sky-300 uppercase tracking-wider mb-2 text-center font-pokemon">
                  Elige tu Pokémon Compañero
                </label>

                <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                  {POKEMON_AVATARS.map((pk) => {
                    const isSelected = selectedAvatar.id === pk.id;
                    return (
                      <button
                        key={pk.id}
                        type="button"
                        onClick={() => setSelectedAvatar(pk)}
                        className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-gradient-to-t from-amber-500/35 to-red-500/20 border-2 border-amber-400 scale-105 shadow-lg shadow-amber-400/25'
                            : 'bg-slate-900/90 border border-slate-800 hover:bg-slate-800 hover:border-slate-600'
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
                  <label className="block text-xs font-bold text-sky-200 uppercase tracking-wider font-pokemon">
                    Nombre de Entrenador
                  </label>
                  <button
                    type="button"
                    onClick={handleRandomNickname}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 font-pokemon cursor-pointer"
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
                  className="w-full text-center text-lg font-bold py-3 bg-slate-950 border-2 border-cyan-400/50 rounded-xl text-amber-300 placeholder-slate-700 focus:outline-none focus:border-amber-400 font-pokemon transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={joining || !nickname.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2 active:translate-y-0.5 cursor-pointer disabled:opacity-50 font-pokemon uppercase tracking-wider border-b-4 border-amber-700"
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
            </div>
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
        <div className={`max-w-2xl w-full mx-auto flex-1 flex flex-col justify-between relative z-10 ${isShaking ? 'animate-shake' : ''}`}>
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

            {currentQuestion && !feedback && (() => {
              const effDur = getQuestionDuration(currentQuestion);
              const maxT = effDur > 0 ? effDur : 30;
              const ratio = timeLeft < 0 ? 1 : Math.min(1, timeLeft / maxT);
              const trainerLevel = 1 + Math.floor((myPlayer?.score || 0) / 1000);
              const isBoss = currentIdx === orderedQuestions.length - 1;
              const opponent = isBoss
                ? GYM_OPPONENTS[GYM_OPPONENTS.length - 1]
                : GYM_OPPONENTS[currentIdx % (GYM_OPPONENTS.length - 1)];

              return (
                <>
                  {/* Authentic Pokémon Battle Arena Stage */}
                  <div className="bg-battle-stage border-2 border-amber-400/40 rounded-3xl p-3 sm:p-4 mb-2.5 flex items-center justify-between gap-2 shadow-xl relative overflow-hidden">
                    {/* Decorative stadium ring */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
                      <div className="w-40 h-16 border-2 border-white rounded-full" />
                    </div>

                    {/* Player Pokémon & Status Box */}
                    <div className="flex items-center gap-2.5 min-w-0 relative z-10">
                      <div className="relative">
                        <div className="w-12 h-3 bg-emerald-400/30 rounded-full blur-sm absolute -bottom-1 left-1/2 -translate-x-1/2" />
                        <img
                          src={myPlayer?.avatar || selectedAvatar.artwork}
                          alt="Tu Pokémon"
                          className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-[0_6px_10px_rgba(16,185,129,0.5)] animate-float relative"
                        />
                      </div>
                      <div className="min-w-0 bg-slate-950/85 border border-emerald-400/40 rounded-xl px-2.5 py-1.5 shadow">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-white truncate max-w-[80px] sm:max-w-[130px] font-pokemon">
                            {myPlayer?.nickname || nickname}
                          </span>
                          <span className="text-[9px] font-pixel bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded">
                            Nv.{trainerLevel}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[8px] font-pixel text-emerald-400">PS</span>
                          <div className="w-16 sm:w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                            <div className="h-full hp-bar-green w-full" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* VS Emblem */}
                    <div className="flex flex-col items-center shrink-0 px-1 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-amber-500 border-2 border-white flex items-center justify-center shadow-lg">
                        <span className="text-[9px] font-pixel text-white">VS</span>
                      </div>
                      {isBoss && (
                        <span className="text-[8px] font-pixel text-amber-200 bg-red-600 px-1.5 py-0.5 rounded border border-amber-300 mt-1 shadow">
                          JEFE
                        </span>
                      )}
                      {myPlayer?.team && REGION_TEAMS[myPlayer.team] && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border mt-1 font-pokemon ${REGION_TEAMS[myPlayer.team].badgeClass}`}>
                          {REGION_TEAMS[myPlayer.team].emoji} {myPlayer.team}
                        </span>
                      )}
                    </div>

                    {/* Opponent Pokémon & Status Box */}
                    <div className="flex items-center gap-2.5 min-w-0 text-right relative z-10">
                      <div className="min-w-0 bg-slate-950/85 border border-red-400/40 rounded-xl px-2.5 py-1.5 shadow">
                        <span className="text-xs font-black text-red-300 truncate block font-pokemon">
                          {opponent.name}
                        </span>
                        <div className="flex items-center justify-end gap-1.5 mt-1">
                          <div className="w-16 sm:w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                            <div className="h-full hp-bar-red w-full" />
                          </div>
                          <span className="text-[8px] font-pixel text-red-400">PS</span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-12 h-3 bg-red-500/30 rounded-full blur-sm absolute -bottom-1 left-1/2 -translate-x-1/2" />
                        <img
                          src={opponent.art}
                          alt={opponent.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-[0_6px_10px_rgba(239,68,68,0.5)] animate-float [animation-delay:0.8s] relative"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Timer Bar (Compact) */}
                  <div className="bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 mb-1.5">
                    <div className="flex items-center justify-between text-[10px] font-pixel text-slate-400 px-0.5 mb-0.5">
                      <span>EXP / TIEMPO</span>
                      <span className={timeLeft >= 0 && ratio <= 0.25 ? 'text-red-400 font-bold animate-pulse' : 'text-slate-300'}>
                        {timeLeft < 0 ? '∞ Sin límite' : `${timeLeft}s`}
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-lg bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className={`h-full rounded-md transition-all duration-1000 ${
                          timeLeft < 0 ? 'hp-bar-green' : ratio <= 0.25 ? 'hp-bar-red' : ratio <= 0.5 ? 'hp-bar-yellow' : 'hp-bar-green'
                        }`}
                        style={{
                          width: timeLeft < 0 ? '100%' : `${Math.max(0, ratio * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {currentQuestion && !feedback && (
            <div className="flex-1 flex flex-col justify-between py-0.5 gap-1.5">
              {session.activeWeather && session.activeWeather.expiresAt > Date.now() && (
                <div className={`rounded-xl px-3 py-1 border text-center text-[11px] font-black font-pokemon animate-pulse ${WEATHER_CONFIG[session.activeWeather.type].bannerClass}`}>
                  {WEATHER_CONFIG[session.activeWeather.type].label} — {WEATHER_CONFIG[session.activeWeather.type].effectDesc}
                </div>
              )}

              <div className="pokemon-dialog-box rounded-2xl p-3 sm:p-4 text-center relative overflow-hidden">
                <div className="absolute top-1 right-2 opacity-10">
                  <PokeballIcon className="w-16 h-16" />
                </div>

                <div className={`flex ${currentQuestion.image ? 'flex-col sm:flex-row items-center gap-3 text-center sm:text-left' : 'items-start justify-center gap-2 text-center'} relative z-10`}>
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <h2 className="text-base sm:text-xl font-bold text-white leading-snug font-pokemon flex-1">
                      {currentQuestion.text}
                    </h2>
                    <button
                      type="button"
                      onClick={() => speakQuestion(currentQuestion.text)}
                      title="Leer pregunta en voz alta"
                      className="shrink-0 w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-amber-400/40 text-amber-300 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {currentQuestion.image && (
                    <div className="shrink-0 rounded-xl overflow-hidden max-h-24 sm:max-h-28 flex items-center justify-center bg-slate-950/70 border border-amber-400/30 shadow-inner p-1">
                      <img
                        src={currentQuestion.image}
                        alt="Ilustración de la pregunta"
                        className="max-h-22 sm:max-h-26 w-auto object-contain rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Power-ups Bar (Mochila de Entrenador) */}
              {session.settings?.powerUpsEnabled !== false && (
              <div className="flex items-center justify-between gap-2 px-1 py-1 mb-2">
                <span className="text-[10px] font-pixel text-slate-400">MOCHILA:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={useFiftyFifty}
                    disabled={powerUps.fiftyFifty <= 0 || currentQuestion.options.length <= 2}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1 border transition-all ${
                      powerUps.fiftyFifty > 0 && currentQuestion.options.length > 2
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 hover:bg-amber-400 hover:text-slate-950 shadow-sm cursor-pointer'
                        : 'bg-slate-900 border-slate-800 text-slate-600 line-through cursor-not-allowed'
                    }`}
                    title="Descarta opciones incorrectas"
                  >
                    <Zap className="w-3 h-3 fill-amber-400" />
                    <span>50/50 {powerUps.fiftyFifty > 0 ? `(x${powerUps.fiftyFifty})` : ''}</span>
                  </button>

                  <button
                    type="button"
                    onClick={useExtraTime}
                    disabled={powerUps.extraTime <= 0 || timeLeft < 0}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1 border transition-all ${
                      powerUps.extraTime > 0 && timeLeft >= 0
                        ? 'bg-sky-400/20 border-sky-400 text-sky-300 hover:bg-sky-400 hover:text-slate-950 shadow-sm cursor-pointer'
                        : 'bg-slate-900 border-slate-800 text-slate-600 line-through cursor-not-allowed'
                    }`}
                    title="Añade +15 segundos a la pregunta"
                  >
                    <Hourglass className="w-3 h-3 text-sky-400" />
                    <span>+15s {powerUps.extraTime > 0 ? `(x${powerUps.extraTime})` : ''}</span>
                  </button>

                  <button
                    type="button"
                    onClick={useDoubleExp}
                    disabled={powerUps.doubleExp <= 0 || isDoubleExpActive}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1 border transition-all ${
                      isDoubleExpActive
                        ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-md animate-pulse'
                        : powerUps.doubleExp > 0
                        ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-slate-950 shadow-sm cursor-pointer'
                        : 'bg-slate-900 border-slate-800 text-slate-600 line-through cursor-not-allowed'
                    }`}
                    title="Duplica los puntos EXP si aciertas"
                  >
                    <Coins className="w-3 h-3 text-yellow-400" />
                    <span>{isDoubleExpActive ? '¡x2 ACTIVO!' : 'Doble EXP'}</span>
                  </button>
                </div>
              </div>
              )}

              {/* PvP Special Attack Bar (Unlocked every 2 streak) */}
              {session.settings?.pvpAttacksEnabled !== false && ((myPlayer?.attackCharges || 0) > 0 || attackFeedback) && (
                <div className="bg-gradient-to-r from-amber-500/20 via-red-600/20 to-amber-500/20 border-2 border-amber-400 rounded-2xl p-2.5 my-1.5 flex flex-col gap-2 shadow-lg animate-in zoom-in-95">
                  {attackFeedback ? (
                    <span className="text-xs font-black text-amber-300 font-pokemon mx-auto">
                      {attackFeedback}
                    </span>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-pixel text-amber-300 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                          ATAQUE LISTO ({myPlayer?.attackCharges}):
                        </span>
                        {(() => {
                          const activeRivals = Object.values(session.players)
                            .filter((r) => r.id !== playerId && !r.isFinished)
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 4);
                          if (activeRivals.length === 0) return null;
                          return (
                            <select
                              value={selectedTargetId}
                              onChange={(e) => setSelectedTargetId(e.target.value)}
                              className="bg-slate-950/90 border border-amber-400/50 text-amber-200 text-[11px] font-bold rounded-lg px-2 py-1 font-pokemon focus:outline-none focus:border-amber-300"
                              aria-label="Elegir rival objetivo"
                            >
                              <option value="">🎯 Objetivo: Líder al azar</option>
                              {activeRivals.map((r) => (
                                <option key={r.id} value={r.id}>
                                  🎯 {r.nickname} ({r.score} EXP)
                                </option>
                              ))}
                            </select>
                          );
                        })()}
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={launchingAttack}
                          onClick={() => handleLaunchAttack('paralyze')}
                          className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1 shadow cursor-pointer font-pokemon active:scale-95 transition-transform"
                        >
                          ⚡ Impactrueno (Paraliza 3s)
                        </button>
                        <button
                          type="button"
                          disabled={launchingAttack}
                          onClick={() => handleLaunchAttack('steal_time')}
                          className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-[11px] flex items-center justify-center gap-1 shadow cursor-pointer font-pokemon active:scale-95 transition-transform"
                        >
                          🔥 Llama Temporal (-5s)
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Incoming Enemy Attack Alert Banner */}
              {incomingAlert && (
                <div className={`rounded-2xl p-2.5 my-1 text-center font-black text-xs font-pokemon border-2 animate-bounce ${
                  incomingAlert.type === 'paralyze'
                    ? 'bg-amber-400 text-slate-950 border-white shadow-lg shadow-amber-400/50'
                    : 'bg-red-600 text-white border-amber-300 shadow-lg shadow-red-600/50'
                }`}>
                  {incomingAlert.type === 'paralyze'
                    ? `⚡ ¡${incomingAlert.fromNickname} te ha lanzado IMPACTRUENO! ¡Paralizado ${paralyzedSec}s!`
                    : `🔥 ¡${incomingAlert.fromNickname} usó LLAMA TEMPORAL! ¡Te quitó 5 segundos!`}
                </div>
              )}

              <div className="relative">
                {attackAnimation && <AttackOverlay data={attackAnimation} />}
                {paralyzedSec > 0 && (
                  <div className="absolute inset-0 z-20 bg-slate-950/70 backdrop-blur-[3px] border-2 border-amber-300 rounded-2xl flex flex-col items-center justify-center text-center p-4 animate-electric gap-2.5">
                    <span className="text-4xl animate-bounce">⚡</span>
                    <span className="text-base font-black text-amber-300 font-pokemon uppercase drop-shadow">
                      ¡PARALIZADO! ({paralyzedSec}s)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        const next = paralysisTaps + 1;
                        if (next >= 4) {
                          sounds.playCorrect();
                          setParalyzedSec(0);
                          setParalysisTaps(0);
                        } else {
                          setParalysisTaps(next);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs font-pokemon uppercase shadow-lg shadow-amber-400/40 active:scale-90 transition-transform cursor-pointer border-b-4 border-amber-600"
                    >
                      ⚡ ¡Toca rápido para liberarte! ({paralysisTaps}/4)
                    </button>
                    <div className="w-40 h-2 bg-slate-800 rounded-full overflow-hidden border border-amber-400/40">
                      <div
                        className="h-full bg-amber-400 transition-all duration-150"
                        style={{ width: `${(paralysisTaps / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
                {currentQuestion.options.map((opt, optIdx) => {
                  const style = attackStyles[optIdx % attackStyles.length];
                  const isHidden = hiddenOptionIds.includes(opt.id);

                  if (isHidden) {
                    return (
                      <div
                        key={opt.id}
                        className="min-h-[54px] sm:min-h-[64px] p-2.5 sm:p-3 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/60 flex items-center justify-center text-slate-600 font-pokemon text-xs line-through select-none"
                      >
                        ⚡ Ataque bloqueado (50/50)
                      </div>
                    );
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => submitAnswer(opt.id)}
                      disabled={answering || paralyzedSec > 0}
                      className={`min-h-[54px] sm:min-h-[64px] p-2.5 sm:p-3 rounded-2xl font-bold text-sm sm:text-base text-white shadow-lg border-b-4 transition-all flex items-center gap-2.5 active:scale-95 cursor-pointer disabled:opacity-50 ${style.bg}`}
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

              {!feedback.isCorrect && currentQuestion && (
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl px-4 py-2 text-xs text-emerald-300 font-bold mb-3 font-pokemon">
                  Respuesta correcta: {currentQuestion.options.find(o => o.isCorrect)?.text}
                </div>
              )}

              {feedback.explanation && session.settings?.showExplanations !== false && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs text-slate-300 max-w-md mx-auto mb-4 text-left">
                  <span className="text-amber-400 font-bold block mb-0.5 uppercase text-[10px] font-pixel">Datos de la Pokédex:</span>
                  {feedback.explanation}
                </div>
              )}

              {session.settings?.paceMode === 'teacher' ? (
                <div className="w-full max-w-sm py-3.5 px-4 rounded-2xl bg-slate-900 border-2 border-emerald-400/50 text-emerald-300 font-black text-xs sm:text-sm font-pokemon text-center animate-pulse mt-2">
                  👨‍🏫 ¡Respuesta guardada! Esperando a que el profesor pase a la siguiente pregunta...
                </div>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full max-w-sm py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-base shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer mt-2 font-pokemon uppercase tracking-wider border-b-4 border-red-800"
                >
                  <span>{currentIdx + 1 >= session.questions.length ? 'Ver Hall de la Fama 🏆' : 'Siguiente Ataque'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
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

          {/* Holographic Trainer Stats Card */}
          <div className="holo-card border-2 border-amber-400/80 rounded-3xl p-5 my-4 space-y-3">
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-pixel">
                EXP Total Acumulada
              </span>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-500 to-pink-500 font-pokemon mt-1">
                {(myPlayer?.score || 0).toLocaleString()} EXP
              </p>
            </div>

            {(() => {
              const sortedPlayers = Object.values(session.players).sort((a, b) => b.score - a.score);
              const myRankIdx = sortedPlayers.findIndex((p) => p.id === playerId);
              const myRank = myRankIdx >= 0 ? myRankIdx + 1 : 0;
              const myReward = session.status === 'finished' && myRank > 0 ? getRewardForRank(myRank) : null;

              if (session.status !== 'finished') {
                return (
                  <div className="bg-slate-950/75 border border-slate-800 rounded-2xl p-2.5 text-center text-[11px] text-amber-300/90 font-pokemon">
                    ⏳ Esperando a que el Líder de Gimnasio cierre la batalla para revelar tu premio oficial Top 6...
                  </div>
                );
              }

              if (myReward) {
                return (
                  <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/15 to-amber-500/20 border-2 border-amber-400/70 rounded-2xl p-3 text-center space-y-1.5 shadow-lg">
                    <div className="text-xs font-black text-amber-300 font-pokemon uppercase">
                      🎁 ¡TU PREMIO OFICIAL DE LA LIGA! ({myRank}º Puesto)
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {myReward.badges.map((badge, bIdx) => (
                        <span
                          key={bIdx}
                          className="text-xs font-black px-2.5 py-1 rounded-xl bg-slate-950/90 text-white border border-amber-400/50 shadow-sm font-pokemon"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }

              return myRank > 0 ? (
                <div className="bg-slate-950/75 border border-slate-800 rounded-2xl p-2.5 text-center text-xs text-slate-300 font-pokemon">
                  Posición final: <strong className="text-white">{myRank}º</strong> de {sortedPlayers.length} entrenadores
                </div>
              ) : null;
            })()}

            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800">
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
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-pixel">Rango</span>
                <span className="text-xs font-black text-amber-300 font-pokemon mt-1 block">
                  {(() => {
                    const correct = myPlayer?.answers.filter(a => a.isCorrect).length || 0;
                    const pct = session.questions.length > 0 ? (correct / session.questions.length) * 100 : 0;
                    if (pct >= 90) return 'Maestro 🏆';
                    if (pct >= 70) return 'Líder 🥇';
                    if (pct >= 50) return 'Experto 🥈';
                    return 'Aprendiz 🌟';
                  })()}
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
                  {orderedQuestions.map((q, idx) => {
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
                          {!ans.isCorrect && (
                            <p className="text-red-400 flex items-center gap-1">
                              <X className="w-3 h-3 shrink-0" />
                              <span>{selectedOpt ? `Tu ataque: ${selectedOpt.text}` : '⏱️ Se agotó el tiempo'}</span>
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

          <div className="text-center space-y-3">
            <p className="text-xs text-amber-300 font-bold font-pokemon animate-pulse">
              Mira la pantalla del Líder de Gimnasio para ver la entrega de medallas 🏅
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black font-pokemon uppercase border border-slate-700 transition-colors"
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span>Volver al Inicio</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
