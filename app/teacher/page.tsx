'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, Play, Edit3, Trash2, Copy, Download, Upload, 
  HelpCircle, Sparkles, BookOpen, Clock, ArrowLeft, Check, AlertCircle, Loader2, Swords, Award, Lock
} from 'lucide-react';
import { Quiz } from '@/lib/types';
import { PokeballIcon, GreatBallIcon, UltraBallIcon } from '@/components/Pokeball';
import { logoutTeacher } from '@/components/TeacherAuthGate';

export default function TeacherDashboard() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingSessionId, setStartingSessionId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/quizzes');
      const data = await res.json();
      let serverQuizzes: Quiz[] = data.success ? data.data : [];

      // Sync with browser localStorage so serverless cold starts never lose teacher's custom quizzes
      if (typeof window !== 'undefined') {
        try {
          const rawLocal = localStorage.getItem('pokequiz_custom_quizzes_v3');
          if (rawLocal) {
            const localQuizzes: Quiz[] = JSON.parse(rawLocal);
            const serverMap = new Map(serverQuizzes.map(q => [q.id, q]));

            for (const lq of localQuizzes) {
              const sq = serverMap.get(lq.id);
              if (!sq || (lq.updatedAt && lq.updatedAt > sq.updatedAt)) {
                await fetch('/api/quizzes', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(lq)
                });
                serverMap.set(lq.id, lq);
              }
            }
            serverQuizzes = Array.from(serverMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
          }
          localStorage.setItem('pokequiz_custom_quizzes_v3', JSON.stringify(serverQuizzes));
        } catch (e) {
          console.warn('Could not sync localStorage quizzes:', e);
        }
      }

      setQuizzes(serverQuizzes);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStartSession = async (quizId: string) => {
    try {
      setStartingSessionId(quizId);
      const quizObj = quizzes.find(q => q.id === quizId);
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, quiz: quizObj })
      });
      const data = await res.json();
      if (data.success && data.data?.pin) {
        router.push(`/teacher/host/${data.data.pin}`);
      } else {
        alert(data.error || 'No se pudo iniciar el combate');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al iniciar el combate');
    } finally {
      setStartingSessionId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Seguro que deseas eliminar el desafío "${title}"?`)) return;
    try {
      const res = await fetch(`/api/quizzes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const remaining = quizzes.filter(q => q.id !== id);
        setQuizzes(remaining);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('pokequiz_custom_quizzes_v3', JSON.stringify(remaining));
          } catch {
            // ignore
          }
        }
        notify('Desafío eliminado');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async (quiz: Quiz) => {
    try {
      const clone: Quiz = {
        ...quiz,
        id: 'quiz_' + Math.random().toString(36).substring(2, 9),
        title: `${quiz.title} (Copia)`,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clone)
      });
      if (res.ok) {
        fetchQuizzes();
        notify('Desafío duplicado');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = (quiz: Quiz) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(quiz, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${quiz.title.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notify('Archivo de desafío descargado');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.title || !json.questions) {
          alert('El archivo no parece ser un cuestionario válido');
          return;
        }
        json.id = 'quiz_' + Math.random().toString(36).substring(2, 9);
        json.title = json.title + ' (Importado)';
        const res = await fetch('/api/quizzes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(json)
        });
        if (res.ok) {
          fetchQuizzes();
          notify('Desafío importado');
        }
      } catch {
        alert('Error al leer el archivo JSON');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-pokemon-pattern text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-red-900/50 bg-slate-900/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <PokeballIcon className="w-7 h-7" />
              <div>
                <h1 className="text-base font-black tracking-wider text-white font-pokemon uppercase flex items-center gap-2">
                  Laboratorio del Docente
                  <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-red-600 text-white shadow-sm">
                    LÍDER DE GIMNASIO
                  </span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImport} 
              accept=".json" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Importar cuestionario desde archivo JSON"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Importar JSON</span>
            </button>

            <Link
              href="/teacher/edit/new"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-xs font-black shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5 font-pokemon uppercase tracking-wider border-b-2 border-red-800"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Crear Nuevo Desafío</span>
            </Link>

            <button
              onClick={logoutTeacher}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 transition-all cursor-pointer"
              title="Bloquear Laboratorio (Cerrar sesión docente)"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 py-8 flex-1">
        {notification && (
          <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-white font-pokemon uppercase flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              <span>Tus Desafíos y Cuestionarios</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Diseña tus propios cuestionarios con imágenes sin límites y lanza partidas a ritmo del alumno.
            </p>
          </div>
          <div className="text-xs text-amber-300 bg-slate-900 border border-amber-400/30 px-3 py-1.5 rounded-xl flex items-center gap-2 self-start font-bold">
            <PokeballIcon className="w-4 h-4" />
            <span>{quizzes.length} Desafío{quizzes.length !== 1 ? 's' : ''} Guardado{quizzes.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <PokeballIcon className="w-10 h-10 mb-3" spinning={true} />
            <p className="text-xs font-pokemon text-amber-300">Cargando biblioteca Pokémon...</p>
          </div>
        )}

        {/* Quizzes Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => {
              const imageCount = quiz.questions.filter(q => !!q.image).length;
              return (
                <div
                  key={quiz.id}
                  className="bg-slate-900/90 border-2 border-slate-800 hover:border-red-500/60 rounded-3xl overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:shadow-red-950/40 group relative"
                >
                  {/* Card Cover */}
                  <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                    {quiz.coverImage || quiz.questions[0]?.image ? (
                      <img
                        src={quiz.coverImage || quiz.questions[0]?.image}
                        alt={quiz.title}
                        className="max-h-40 max-w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-950">
                        <PokeballIcon className="w-16 h-16 opacity-30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    
                    {quiz.category && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-slate-950/90 backdrop-blur-sm text-amber-300 text-[11px] font-bold border border-amber-400/30">
                        {quiz.category}
                      </span>
                    )}

                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-md backdrop-blur text-[11px]">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        {quiz.questions.length} preguntas
                      </span>
                      {imageCount > 0 && (
                        <span className="bg-red-600/90 text-white font-bold px-2 py-0.5 rounded-md text-[11px]">
                          {imageCount} fotos 📸
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors line-clamp-1 font-pokemon">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {quiz.description || 'Sin descripción'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
                      <button
                        onClick={() => handleStartSession(quiz.id)}
                        disabled={startingSessionId === quiz.id}
                        className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50 font-pokemon uppercase tracking-wider border-b-2 border-red-800"
                      >
                        {startingSessionId === quiz.id ? (
                          <PokeballIcon className="w-4 h-4" spinning={true} />
                        ) : (
                          <Swords className="w-4 h-4" />
                        )}
                        <span>Iniciar Combate en Vivo</span>
                      </button>

                      <div className="flex items-center justify-between pt-1 gap-1">
                        <Link
                          href={`/teacher/edit/${quiz.id}`}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Editar</span>
                        </Link>

                        <button
                          onClick={() => handleDuplicate(quiz)}
                          title="Duplicar cuestionario"
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleExport(quiz)}
                          title="Exportar archivo JSON"
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(quiz.id, quiz.title)}
                          title="Eliminar cuestionario"
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
