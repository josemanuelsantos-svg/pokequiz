'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Shield, Sparkles, ArrowRight, Flame, Swords } from 'lucide-react';
import { PokeballIcon, GreatBallIcon, UltraBallIcon } from '@/components/Pokeball';

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
      {/* Decorative Pokémon Silhouettes / Background Accents */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -right-20 opacity-5 pointer-events-none">
        <PokeballIcon className="w-96 h-96" />
      </div>

      {/* Top Navbar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/30 p-1.5 border-2 border-amber-300">
            <PokeballIcon className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-wider text-white font-pokemon uppercase">
                Poké<span className="text-amber-400">Quiz</span>
              </span>
              <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-red-600 text-white uppercase shadow-sm">
                EDICIÓN ORO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Liga de Aprendizaje Escolar</p>
          </div>
        </div>

        <Link
          href="/teacher"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-amber-200 font-bold text-xs border border-amber-400/30 shadow-md hover:border-amber-400 transition-all cursor-pointer"
        >
          <PokeballIcon className="w-4 h-4" />
          <span>Laboratorio del Docente</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl w-full mx-auto my-auto flex flex-col items-center text-center py-8 relative z-10">
        {/* Floating Starters */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
            alt="Pikachu"
            className="w-16 h-16 md:w-20 md:h-20 drop-shadow-[0_10px_10px_rgba(251,191,36,0.3)] animate-float"
          />
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
            alt="Charmander"
            className="w-14 h-14 md:w-16 md:h-16 drop-shadow-[0_10px_10px_rgba(249,115,22,0.3)] animate-float [animation-delay:0.5s]"
          />
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
            alt="Squirtle"
            className="w-14 h-14 md:w-16 md:h-16 drop-shadow-[0_10px_10px_rgba(59,130,246,0.3)] animate-float [animation-delay:1s]"
          />
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
            alt="Bulbasaur"
            className="w-14 h-14 md:w-16 md:h-16 drop-shadow-[0_10px_10px_rgba(16,185,129,0.3)] animate-float [animation-delay:1.5s]"
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-amber-300 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>¡Sube imágenes sin límites y reta a tus alumnos a su propio ritmo!</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-3 font-pokemon uppercase">
          ¡Conviértete en <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-500 to-pink-500">Maestro Pokémon</span>!
        </h1>
        
        <p className="text-slate-300 text-sm md:text-base max-w-xl mb-8">
          Preguntas dinámicas con feedback instantáneo y efectos súper efectivos. Cada alumno avanza a su velocidad mientras el Líder de Gimnasio proyecta la clasificación en vivo.
        </p>

        {/* Pokédex Entry PIN Box */}
        <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-red-600/70 rounded-3xl p-6 md:p-8 shadow-2xl relative shadow-red-950/40">
          {/* Top Pokédex Sensor Lights */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-lg shadow-cyan-400/50 animate-pulse" />
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] font-pixel text-amber-400 tracking-wider">GYM-PASS v2.0</span>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label htmlFor="pin-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Código PIN del Gimnasio
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
                placeholder="Ej. 654321"
                className="w-full text-center tracking-widest text-3xl font-black py-4 bg-slate-950 border-2 border-amber-400/60 rounded-2xl text-amber-300 placeholder-slate-700 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 font-pokemon transition-all"
              />
              {error && <p className="text-red-400 text-xs mt-2 font-bold">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-lg shadow-xl shadow-red-600/40 hover:shadow-red-600/60 transition-all flex items-center justify-center gap-3 active:scale-95 cursor-pointer border-b-4 border-red-800 uppercase font-pokemon tracking-wider"
            >
              <PokeballIcon className="w-6 h-6 animate-spin [animation-duration:4s]" />
              <span>¡Entrar al Combate!</span>
            </button>
          </form>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 w-full max-w-3xl text-left">
          <div className="bg-slate-900/80 border border-red-500/20 rounded-2xl p-4 hover:border-red-500/50 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-2">
              <PokeballIcon className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-sm">Sin Límite de Fotos</h3>
            <p className="text-slate-400 text-xs mt-1">Sube siluetas, mapas, criaturas y esquemas en alta resolución sin coste.</p>
          </div>

          <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-4 hover:border-amber-500/50 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-sm">EXP y Rachas Críticas</h3>
            <p className="text-slate-400 text-xs mt-1">Gana puntos de experiencia por rapidez y encadena ataques súper efectivos.</p>
          </div>

          <div className="bg-slate-900/80 border border-blue-500/20 rounded-2xl p-4 hover:border-blue-500/50 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
              <Swords className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-sm">Ritmo del Entrenador</h3>
            <p className="text-slate-400 text-xs mt-1">Cada alumno avanza a su velocidad. El docente ve la Liga en tiempo real.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto py-3 text-center text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2 border-t border-slate-800/80 relative z-10">
        <div className="flex items-center justify-center gap-2">
          <PokeballIcon className="w-4 h-4" />
          <span>PokéQuiz • Plataforma educativa personalizada para tus proyectos</span>
        </div>
        <Link href="/teacher" className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1">
          Crear Cuestionarios en el Laboratorio <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </footer>
    </div>
  );
}
