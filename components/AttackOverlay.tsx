'use client';

import React from 'react';
import { Zap, Flame } from 'lucide-react';

export interface AttackAnimationData {
  mode: 'outgoing' | 'incoming';
  type: 'paralyze' | 'steal_time';
  attackerNickname: string;
  attackerAvatar?: string;
  targetNickname: string;
  targetAvatar?: string;
}

function AvatarBadge({ avatar, nickname, className = '' }: { avatar?: string; nickname: string; className?: string }) {
  if (avatar && avatar.startsWith('http')) {
    return (
      <img
        src={avatar}
        alt={nickname}
        className={`w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.65)] ${className}`}
      />
    );
  }
  return (
    <span className={`text-4xl sm:text-5xl inline-block drop-shadow ${className}`}>
      {avatar || '⚡'}
    </span>
  );
}

export function AttackOverlay({ data }: { data: AttackAnimationData }) {
  const isThunder = data.type === 'paralyze';
  const isOutgoing = data.mode === 'outgoing';

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 ${
        isThunder ? 'animate-thunder-bg' : 'animate-fire-bg'
      }`}
    >
      <div
        className={`animate-clash-pop max-w-md w-full rounded-3xl border-4 p-5 shadow-2xl backdrop-blur-md text-center ${
          isThunder
            ? 'bg-slate-950/90 border-amber-400 shadow-amber-400/40'
            : 'bg-slate-950/90 border-orange-500 shadow-red-600/40'
        }`}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          {isThunder ? (
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce" />
          ) : (
            <Flame className="w-5 h-5 text-orange-400 fill-orange-500 animate-bounce" />
          )}
          <span
            className={`text-xs sm:text-sm font-black font-pokemon uppercase tracking-wider ${
              isThunder ? 'text-amber-300' : 'text-orange-300'
            }`}
          >
            {isOutgoing ? '¡ATAQUE LANZADO!' : '¡ATAQUE RIVAL RECIBIDO!'}
          </span>
        </div>

        {/* Visual Pokémon Duel Clash: Attacker -> Projectile -> Target */}
        <div className="flex items-center justify-between gap-2 px-3 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden">
          <div className="flex flex-col items-center z-10 w-24">
            <AvatarBadge
              avatar={data.attackerAvatar}
              nickname={data.attackerNickname}
              className="animate-lunge-right"
            />
            <span className="text-[11px] font-black text-white truncate max-w-[90px] mt-1 font-pokemon">
              {data.attackerNickname}
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
            <div className="animate-projectile flex items-center justify-center">
              {isThunder ? (
                <span className="text-4xl sm:text-5xl drop-shadow-[0_0_16px_rgba(250,204,21,0.95)]">
                  ⚡⚡
                </span>
              ) : (
                <span className="text-4xl sm:text-5xl drop-shadow-[0_0_16px_rgba(249,115,22,0.95)]">
                  🔥🔥
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-pixel uppercase mt-1 px-2 py-0.5 rounded-full ${
                isThunder
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-red-600 text-white'
              }`}
            >
              {isThunder ? 'IMPACTRUENO' : 'LLAMA TEMPORAL'}
            </span>
          </div>

          <div className="flex flex-col items-center z-10 w-24">
            <AvatarBadge
              avatar={data.targetAvatar}
              nickname={data.targetNickname}
              className="animate-target-hit"
            />
            <span className="text-[11px] font-black text-amber-300 truncate max-w-[90px] mt-1 font-pokemon">
              {data.targetNickname}
            </span>
          </div>
        </div>

        <p
          className={`mt-3 text-sm font-black font-pokemon ${
            isThunder ? 'text-amber-200' : 'text-red-300'
          }`}
        >
          {isThunder
            ? isOutgoing
              ? `⚡ ¡${data.targetNickname} queda PARALIZADO 3s!`
              : `⚡ ¡${data.attackerNickname} te paralizó! ¡Toca rápido para liberarte!`
            : isOutgoing
            ? `🔥 ¡Le quitaste 5 segundos a ${data.targetNickname}!`
            : `🔥 ¡${data.attackerNickname} te quitó 5 segundos del reloj!`}
        </p>
      </div>
    </div>
  );
}
