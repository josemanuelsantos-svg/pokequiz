'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Sparkles, ArrowRight, Swords, ShieldCheck, Star } from 'lucide-react';
import { PokeballIcon } from '@/components/Pokeball';

export default function HomePage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim().replace(/\s+/g, '');
    if (!cleanPin || cleanPin.length < 5) {
      setError('Introduce el código de combate (6 dígitos)');
      return;
    }
    router.push(`/play/${cleanPin}`);
  };

  return (
    <div className="min-h-screen bg-pokemon-pattern flex flex-col justify-between p-4 md:p-8 relative overflow-hidden">
      {/* Decorative Giant Pokéballs & Ambient Stadium Glows */}
      <div className="absolute -top-28 -left-28 opacity-[0.06] pointer-events-none rotate-12">
        <PokeballIcon className="w-[420px] h-[420px]" />
      </div>
      <div className="absolute -bottom-32 -right-24 opacity-[0.06] pointer-events-none -rotate-12">
        <PokeballIcon className="w-[460px] h-[460px]" />
      </div>

      {/* Top Navbar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2.5 px-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-xl relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/40 p-1.5 border-2 border-amber-300">
            <PokeballIcon className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-wider text-white font-pokemon uppercase drop-shadow">
                Poké<span className="text-amber-400">Quiz</span>
              </span>
              <span className="text-[9px] font-pixel px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 uppercase shadow-sm">
                LIGA ESCOLAR
              </span>
            </div>
            <p className="text-[11px] text-sky-200/80 font-semibold">Gimnasio Educativo Pokémon</p>
          </div>
        </div>

        <Link
          href="/teacher"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/25 transition-all cursor-pointer border-b-2 border-amber-600 font-pokemon uppercase tracking-wide"
        >
          <PokeballIcon className="w-4 h-4" />
          <span>Laboratorio del Docente</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl w-full mx-auto my-auto flex flex-col items-center text-center py-6 md:py-8 relative z-10">
        {/* Pokémon Starters & Legends Showcase */}
        <div className="flex items-end justify-center gap-2 sm:gap-5 mb-4">
          <div className="relative group hidden sm:block">
            <div className="absolute inset-0 bg-orange-500/25 rounded-full blur-xl" />
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png"
              alt="Charizard"
              className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_12px_16px_rgba(249,115,22,0.45)] animate-float [animation-delay:0.4s] relative"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/25 rounded-full blur-xl" />
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
              alt="Bulbasaur"
              className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_12px_14px_rgba(16,185,129,0.45)] animate-float [animation-delay:1.1s] relative"
            />
          </div>
          <div className="relative -mt-2">
            <div className="absolute inset-0 bg-amber-400/35 rounded-full blur-2xl" />
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
              alt="Pikachu"
              className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-[0_14px_20px_rgba(251,191,36,0.55)] animate-float relative"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-sky-500/25 rounded-full blur-xl" />
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
              alt="Squirtle"
              className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_12px_14px_rgba(56,189,248,0.45)] animate-float [animation-delay:0.8s] relative"
            />
          </div>
          <div className="relative group hidden sm:block">
            <div className="absolute inset-0 bg-amber-500/25 rounded-full blur-xl" />
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png"
              alt="Eevee"
              className="w-18 h-18 md:w-20 md:h-20 object-contain drop-shadow-[0_12px_16px_rgba(245,158,11,0.45)] animate-float [animation-delay:1.5s] relative"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-bold mb-3 shadow-lg backdrop-blur-sm">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>¡Elige tu Pokémon, responde a tu ritmo y conquista el Gimnasio!</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-3 font-pokemon uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
          ¡Conviértete en{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400">
            Maestro Pokémon
          </span>
          !
        </h1>

        <p className="text-sky-100/85 text-sm md:text-base max-w-xl mb-7 font-medium">
          Batallas educativas en clase con ataques súper efectivos, comodines en tu mochila y clasificación en tiempo real en la pizarra.
        </p>

        {/* Authentic Red Pokédex Hardware Entry Box */}
        <div className="w-full max-w-md pokedex-shell rounded-[2rem] p-4 sm:p-5 border-2 border-red-400/50 relative">
          {/* Top Pokédex Camera Lens & Status LEDs */}
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b-2 border-red-950/60">
            <div className="flex items-center gap-2.5">
              {/* Big Cyan Pokédex Lens */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-600 border-[3px] border-white shadow-[0_0_16px_rgba(34,211,238,0.85)] relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white/80 absolute top-1 left-1.5" />
              </div>
              <span className="w-3 h-3 rounded-full bg-red-400 border border-red-900 shadow-inner" />
              <span className="w-3 h-3 rounded-full bg-amber-300 border border-amber-700 shadow-inner" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-800 shadow-inner animate-pulse" />
            </div>
            <span className="text-[10px] font-pixel text-amber-200 tracking-wider bg-red-950/60 px-2.5 py-1 rounded-lg border border-red-400/30">
              POKÉDEX PASS
            </span>
          </div>

          {/* Inner Dark Screen */}
          <div className="pokedex-screen rounded-2xl p-5 sm:p-6">
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label
                  htmlFor="pin-input"
                  className="block text-xs font-black text-sky-300 uppercase tracking-widest mb-2 font-pokemon"
                >
                  Introduce el Código PIN del Gimnasio
                </label>
                <input
                  id="pin-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError('');
                  }}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.25em] text-3xl sm:text-4xl font-black py-4 bg-slate-950/90 border-2 border-cyan-400/50 rounded-2xl text-amber-300 placeholder-slate-700 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/25 font-pokemon transition-all shadow-inner"
                />
                {error && <p className="text-rose-400 text-xs mt-2 font-bold">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-3 active:translate-y-0.5 cursor-pointer border-b-4 border-amber-700 uppercase font-pokemon tracking-wider"
              >
                <PokeballIcon className="w-6 h-6 animate-spin [animation-duration:4s]" />
                <span>¡Entrar al Combate!</span>
              </button>
            </form>
          </div>
        </div>

        {/* 3 Elemental Feature Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-9 w-full max-w-3xl text-left">
          <div className="bg-gradient-to-br from-red-950/70 to-slate-900/90 border-2 border-red-500/30 rounded-2xl p-4 hover:border-red-400 transition-all shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                <PokeballIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-pixel text-red-300 bg-red-500/15 px-2 py-0.5 rounded">TIPO FUEGO</span>
            </div>
            <h3 className="text-white font-black text-sm font-pokemon uppercase">Imágenes Sin Límites</h3>
            <p className="text-slate-300 text-xs mt-1">Busca fotos en internet o en la Pokédex al instante, sin descargar nada.</p>
          </div>

          <div className="bg-gradient-to-br from-amber-950/60 to-slate-900/90 border-2 border-amber-400/30 rounded-2xl p-4 hover:border-amber-400 transition-all shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                <Zap className="w-5 h-5 fill-amber-400" />
              </div>
              <span className="text-[10px] font-pixel text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded">ELÉCTRICO</span>
            </div>
            <h3 className="text-white font-black text-sm font-pokemon uppercase">Combates y Comodines</h3>
            <p className="text-slate-300 text-xs mt-1">Sube de nivel, usa el 50/50 o Doble EXP y derrota al Jefe del Gimnasio.</p>
          </div>

          <div className="bg-gradient-to-br from-sky-950/70 to-slate-900/90 border-2 border-sky-400/30 rounded-2xl p-4 hover:border-sky-400 transition-all shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-400/30">
                <Swords className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-pixel text-sky-300 bg-sky-400/15 px-2 py-0.5 rounded">TIPO AGUA</span>
            </div>
            <h3 className="text-white font-black text-sm font-pokemon uppercase">Ritmo del Entrenador</h3>
            <p className="text-slate-300 text-xs mt-1">Cada alumno avanza a su paso mientras la Liga se proyecta en directo.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto py-3 px-4 text-center text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-2 border-t border-white/10 relative z-10">
        <div className="flex items-center justify-center gap-2">
          <PokeballIcon className="w-4 h-4" />
          <span>PokéQuiz • Liga Escolar de Aprendizaje Gamificado</span>
        </div>
        <Link href="/teacher" className="text-amber-300 hover:text-amber-200 font-bold inline-flex items-center gap-1">
          Acceso Docentes: Laboratorio Oak <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </footer>
    </div>
  );
}
