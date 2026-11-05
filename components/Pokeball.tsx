import React from 'react';

interface PokeballProps {
  className?: string;
  spinning?: boolean;
}

export function PokeballIcon({ className = 'w-6 h-6', spinning = false }: PokeballProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} ${spinning ? 'animate-spin' : ''} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle */}
      <circle cx="50" cy="50" r="46" stroke="#0f172a" strokeWidth="7" fill="#f8fafc" />
      {/* Top Red Half */}
      <path d="M 4 50 A 46 46 0 0 1 96 50 Z" fill="#ef4444" />
      {/* Center Black Line */}
      <line x1="4" y1="50" x2="96" y2="50" stroke="#0f172a" strokeWidth="7" />
      {/* Outer Ring */}
      <circle cx="50" cy="50" r="16" fill="#f8fafc" stroke="#0f172a" strokeWidth="7" />
      {/* Inner Button */}
      <circle cx="50" cy="50" r="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
    </svg>
  );
}

export function GreatBallIcon({ className = 'w-6 h-6' }: PokeballProps) {
  return (
    <svg viewBox="0 0 100 100" className={`${className} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="#0f172a" strokeWidth="7" fill="#f8fafc" />
      <path d="M 4 50 A 46 46 0 0 1 96 50 Z" fill="#2563eb" />
      <path d="M 22 25 L 36 36 L 26 48" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
      <path d="M 78 25 L 64 36 L 74 48" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
      <line x1="4" y1="50" x2="96" y2="50" stroke="#0f172a" strokeWidth="7" />
      <circle cx="50" cy="50" r="16" fill="#f8fafc" stroke="#0f172a" strokeWidth="7" />
      <circle cx="50" cy="50" r="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
    </svg>
  );
}

export function UltraBallIcon({ className = 'w-6 h-6' }: PokeballProps) {
  return (
    <svg viewBox="0 0 100 100" className={`${className} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="#0f172a" strokeWidth="7" fill="#f8fafc" />
      <path d="M 4 50 A 46 46 0 0 1 96 50 Z" fill="#1e293b" />
      <path d="M 28 8 A 38 38 0 0 1 72 8 L 68 25 A 25 25 0 0 0 32 25 Z" fill="#eab308" />
      <line x1="4" y1="50" x2="96" y2="50" stroke="#0f172a" strokeWidth="7" />
      <circle cx="50" cy="50" r="16" fill="#f8fafc" stroke="#0f172a" strokeWidth="7" />
      <circle cx="50" cy="50" r="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
    </svg>
  );
}
