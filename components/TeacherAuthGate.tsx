'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldAlert, KeyRound } from 'lucide-react';
import { PokeballIcon } from './Pokeball';
import { sounds } from '@/lib/sound';

const TEACHER_PASSWORD = 'Alabadoseaslider';
const AUTH_STORAGE_KEY = 'pokequiz_teacher_auth_v1';

export function logoutTeacher() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.location.href = '/';
  }
}

export function TeacherAuthGate({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved === TEACHER_PASSWORD) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === TEACHER_PASSWORD) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(AUTH_STORAGE_KEY, TEACHER_PASSWORD);
        localStorage.setItem(AUTH_STORAGE_KEY, TEACHER_PASSWORD);
      }
      sounds.playCorrect();
      setAuthorized(true);
      setError('');
    } else {
      sounds.playIncorrect();
      setError('Contraseña incorrecta. Acceso exclusivo para docentes.');
    }
  };

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-pokemon-pattern flex items-center justify-center">
        <PokeballIcon className="w-10 h-10" spinning={true} />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-pokemon-pattern flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="max-w-md w-full bg-slate-900/95 border-2 border-red-600/70 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
          {/* Top Pokédex Sensor Lights */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg shadow-red-500/50 animate-pulse" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] font-pixel text-amber-400 tracking-wider">SEGURIDAD DOCENTE</span>
          </div>

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-red-600/20 border-2 border-amber-400/50 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h1 className="text-2xl font-black text-white font-pokemon uppercase">
              Laboratorio del Docente
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Introduce la clave de Líder de Gimnasio para gestionar y lanzar las pruebas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="teacher-pass" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-pokemon">
                Contraseña de Profesor
              </label>
              <div className="relative">
                <input
                  id="teacher-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Introduce la contraseña..."
                  autoFocus
                  className="w-full py-3.5 pl-4 pr-11 bg-slate-950 border-2 border-amber-400/60 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-pokemon text-base transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && (
                <div className="mt-2 flex items-center gap-1.5 text-red-400 text-xs font-bold">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-base shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer font-pokemon uppercase tracking-wider border-b-4 border-red-800"
            >
              <KeyRound className="w-5 h-5" />
              <span>Desbloquear Laboratorio</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 font-pokemon transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Soy alumno • Volver a la pantalla de PIN</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
