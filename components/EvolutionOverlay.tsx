'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export interface EvolutionEventData {
  fromName: string;
  toName: string;
  fromArtwork: string;
  toArtwork: string;
  stage: number;
}

export function EvolutionOverlay({ data }: { data: EvolutionEventData }) {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="animate-clash-pop max-w-md w-full rounded-3xl border-4 border-amber-300 bg-gradient-to-b from-indigo-950 via-slate-900 to-amber-950/80 p-6 shadow-[0_0_60px_rgba(251,191,36,0.55)] text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-amber-300">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span className="text-xs font-pixel uppercase tracking-widest">
            ¡EVOLUCIÓN POKÉMON! (FASE {data.stage})
          </span>
          <Sparkles className="w-5 h-5 animate-spin" />
        </div>

        <div className="flex items-center justify-center gap-4 py-2">
          <div className="flex flex-col items-center opacity-70 scale-90">
            <img
              src={data.fromArtwork}
              alt={data.fromName}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain grayscale-[30%]"
            />
            <span className="text-[11px] font-bold text-slate-400 font-pokemon mt-1">
              {data.fromName}
            </span>
          </div>

          <span className="text-3xl font-black text-amber-400 animate-pulse">➔</span>

          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-amber-400/35 blur-xl animate-pulse" />
              <img
                src={data.toArtwork}
                alt={data.toName}
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain relative z-10 drop-shadow-[0_0_24px_rgba(251,191,36,0.9)] animate-bounce"
              />
            </div>
            <span className="text-sm sm:text-base font-black text-amber-300 font-pokemon mt-1 uppercase">
              {data.toName}
            </span>
          </div>
        </div>

        <p className="text-sm font-black text-white font-pokemon">
          ✨ ¡Tu <span className="text-sky-300">{data.fromName}</span> ha evolucionado a{' '}
          <span className="text-amber-300">{data.toName}</span>! ✨
        </p>
      </div>
    </div>
  );
}
