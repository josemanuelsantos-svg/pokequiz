'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Save, Plus, Trash2, Copy, Image as ImageIcon, 
  Clock, CheckCircle2, AlertCircle, Sparkles, Check, Link as LinkIcon,
  HelpCircle, Eye, Loader2, Swords, Zap, ArrowUp, ArrowDown, Settings, X
} from 'lucide-react';
import { Quiz, Question, QuestionOption } from '@/lib/types';
import { processImageFile } from '@/lib/image-upload';
import { PokeballIcon } from '@/components/Pokeball';

export default function QuizEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);

  const handleGenerateAi = async () => {
    if (!aiTopic.trim()) return;
    try {
      setGeneratingAi(true);
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic.trim() })
      });
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setQuiz(prev => ({
          ...prev,
          questions: [...prev.questions, ...data.data]
        }));
        setShowAiModal(false);
        setAiTopic('');
        setActiveQuestionIdx(quiz.questions.length);
      } else {
        alert(data.error || 'No se pudieron generar preguntas');
      }
    } catch {
      alert('Error de conexión al generar preguntas');
    } finally {
      setGeneratingAi(false);
    }
  };

  const [quiz, setQuiz] = useState<Quiz>({
    id: isNew ? 'quiz_' + Math.random().toString(36).substring(2, 9) : id,
    title: 'Nuevo Desafío Pokémon',
    description: '',
    category: 'Mundo Pokémon',
    coverImage: '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    questions: [
      {
        id: 'q_1',
        text: '¿Cuál es la respuesta correcta a esta pregunta?',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'opt_1', text: 'Ataque Fuego 🔥', isCorrect: true },
          { id: 'opt_2', text: 'Ataque Agua 💧', isCorrect: false },
          { id: 'opt_3', text: 'Ataque Eléctrico ⚡', isCorrect: false },
          { id: 'opt_4', text: 'Ataque Planta 🍃', isCorrect: false },
        ]
      }
    ]
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/quizzes/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setQuiz(data.data);
          } else if (typeof window !== 'undefined') {
            const rawLocal = localStorage.getItem('pokequiz_custom_quizzes');
            if (rawLocal) {
              const localList: Quiz[] = JSON.parse(rawLocal);
              const found = localList.find(q => q.id === id);
              if (found) setQuiz(found);
            }
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const currentQuestion = quiz.questions[activeQuestionIdx] || quiz.questions[0];

  const updateCurrentQuestion = (updates: Partial<Question>) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[activeQuestionIdx] = {
      ...updatedQuestions[activeQuestionIdx],
      ...updates
    };
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    const newQ: Question = {
      id: 'q_' + Math.random().toString(36).substring(2, 9),
      text: `Pregunta ${quiz.questions.length + 1}`,
      timeLimit: 20,
      points: 1000,
      options: [
        { id: 'opt_' + Math.random().toString(36).substring(2, 7), text: '', isCorrect: true },
        { id: 'opt_' + Math.random().toString(36).substring(2, 7), text: '', isCorrect: false },
        { id: 'opt_' + Math.random().toString(36).substring(2, 7), text: '', isCorrect: false },
        { id: 'opt_' + Math.random().toString(36).substring(2, 7), text: '', isCorrect: false },
      ]
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQ] });
    setActiveQuestionIdx(quiz.questions.length);
  };

  const moveQuestion = (idx: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === quiz.questions.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...quiz.questions];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);

    setQuiz({ ...quiz, questions: updated });
    setActiveQuestionIdx(targetIdx);
  };

  const duplicateQuestion = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const source = quiz.questions[idx];
    const clone: Question = {
      ...JSON.parse(JSON.stringify(source)),
      id: 'q_' + Math.random().toString(36).substring(2, 9),
      text: `${source.text} (Copia)`
    };
    const updated = [...quiz.questions];
    updated.splice(idx + 1, 0, clone);
    setQuiz({ ...quiz, questions: updated });
    setActiveQuestionIdx(idx + 1);
  };

  const deleteQuestion = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (quiz.questions.length <= 1) {
      alert('El desafío debe contener al menos una pregunta');
      return;
    }
    const updated = quiz.questions.filter((_, i) => i !== idx);
    setQuiz({ ...quiz, questions: updated });
    setActiveQuestionIdx(Math.max(0, idx - 1));
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file);
      updateCurrentQuestion({ image: dataUrl });
    } catch {
      alert('Error al procesar la imagen.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, 800, 600);
      setQuiz({ ...quiz, coverImage: dataUrl });
    } catch {
      alert('Error al procesar la portada.');
    }
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      updateCurrentQuestion({ image: imageUrlInput.trim() });
      setImageUrlInput('');
      setShowUrlInput(false);
    }
  };

  const setTrueFalseOptions = () => {
    updateCurrentQuestion({
      options: [
        { id: 'tf_1', text: 'Verdadero', isCorrect: true },
        { id: 'tf_2', text: 'Falso', isCorrect: false }
      ]
    });
  };

  const setFourOptions = () => {
    if (currentQuestion.options.length > 2) return;
    updateCurrentQuestion({
      options: [
        { id: 'opt_1', text: 'Opción 1', isCorrect: true },
        { id: 'opt_2', text: 'Opción 2', isCorrect: false },
        { id: 'opt_3', text: 'Opción 3', isCorrect: false },
        { id: 'opt_4', text: 'Opción 4', isCorrect: false },
      ]
    });
  };

  const addIndividualOption = () => {
    if (currentQuestion.options.length >= 6) {
      alert('Máximo 6 opciones por pregunta');
      return;
    }
    const newOpt: QuestionOption = {
      id: 'opt_' + Math.random().toString(36).substring(2, 7),
      text: '',
      isCorrect: false
    };
    updateCurrentQuestion({ options: [...currentQuestion.options, newOpt] });
  };

  const removeIndividualOption = (optIdx: number) => {
    if (currentQuestion.options.length <= 2) {
      alert('Debe haber al menos 2 opciones');
      return;
    }
    const updated = currentQuestion.options.filter((_, i) => i !== optIdx);
    // If we removed the correct option, default first to correct
    if (!updated.some(o => o.isCorrect)) {
      updated[0].isCorrect = true;
    }
    updateCurrentQuestion({ options: updated });
  };

  const handleOptionTextChange = (optIdx: number, val: string) => {
    const opts = [...currentQuestion.options];
    opts[optIdx] = { ...opts[optIdx], text: val };
    updateCurrentQuestion({ options: opts });
  };

  const setCorrectOption = (optIdx: number) => {
    const opts = currentQuestion.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === optIdx
    }));
    updateCurrentQuestion({ options: opts });
  };

  const handleSave = async () => {
    if (!quiz.title.trim()) {
      alert('Por favor añade un título al cuestionario');
      return;
    }

    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      if (!q.text.trim()) {
        alert(`La pregunta ${i + 1} no tiene enunciado`);
        setActiveQuestionIdx(i);
        return;
      }
      const emptyOpt = q.options.findIndex(o => !o.text.trim());
      if (emptyOpt !== -1) {
        alert(`La opción ${emptyOpt + 1} de la pregunta ${i + 1} está vacía`);
        setActiveQuestionIdx(i);
        return;
      }
      const hasCorrect = q.options.some(o => o.isCorrect);
      if (!hasCorrect) {
        alert(`La pregunta ${i + 1} debe tener al menos una respuesta marcada como correcta`);
        setActiveQuestionIdx(i);
        return;
      }
    }

    try {
      setSaving(true);
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz)
      });
      const data = await res.json();
      if (data.success) {
        const savedQuiz: Quiz = data.data;
        if (typeof window !== 'undefined') {
          try {
            const rawLocal = localStorage.getItem('pokequiz_custom_quizzes');
            const localList: Quiz[] = rawLocal ? JSON.parse(rawLocal) : [];
            const idx = localList.findIndex(q => q.id === savedQuiz.id);
            if (idx >= 0) {
              localList[idx] = savedQuiz;
            } else {
              localList.unshift(savedQuiz);
            }
            localStorage.setItem('pokequiz_custom_quizzes', JSON.stringify(localList));
          } catch {
            // ignore
          }
        }
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
        if (isNew) {
          router.replace(`/teacher/edit/${savedQuiz.id}`);
        }
      } else {
        alert(data.error || 'Error al guardar');
      }
    } catch {
      alert('Error de conexión al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pokemon-pattern flex items-center justify-center text-amber-300 font-pokemon">
        <PokeballIcon className="w-8 h-8 mr-2" spinning={true} />
        <span>Cargando datos del desafío...</span>
      </div>
    );
  }

  const optionColors = [
    { bg: 'border-red-500/60 bg-red-950/20', badge: 'bg-red-600 text-white', icon: '🔥', label: 'FUEGO' },
    { bg: 'border-blue-500/60 bg-blue-950/20', badge: 'bg-blue-600 text-white', icon: '💧', label: 'AGUA' },
    { bg: 'border-amber-500/60 bg-amber-950/20', badge: 'bg-amber-500 text-slate-950', icon: '⚡', label: 'ELÉCTRICO' },
    { bg: 'border-emerald-500/60 bg-emerald-950/20', badge: 'bg-emerald-600 text-white', icon: '🍃', label: 'PLANTA' },
    { bg: 'border-purple-500/60 bg-purple-950/20', badge: 'bg-purple-600 text-white', icon: '🔮', label: 'PSÍQUICO' },
    { bg: 'border-pink-500/60 bg-pink-950/20', badge: 'bg-pink-600 text-white', icon: '✨', label: 'HADA' },
  ];

  return (
    <div className="min-h-screen bg-pokemon-pattern text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-red-900/50 bg-slate-900/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/teacher"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex flex-col">
              <input
                type="text"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                placeholder="Título del Desafío Pokémon"
                className="bg-transparent text-lg font-black text-white focus:outline-none focus:ring-1 focus:ring-amber-400 rounded px-1 -ml-1 border-b border-transparent hover:border-slate-700 max-w-sm sm:max-w-md font-pokemon"
              />
              <span className="text-xs text-slate-400 px-1 font-pokemon">
                {quiz.questions.length} preguntas • {quiz.category || 'Mundo Pokémon'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAiModal(true)}
              className="p-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 text-amber-300 border border-amber-400/40 transition-all flex items-center gap-1.5 text-xs font-bold font-pokemon cursor-pointer"
              title="Generar preguntas automáticamente con IA"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Asistente Oak (IA)</span>
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold font-pokemon cursor-pointer"
              title="Configurar portada y categoría del quiz"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Ajustes</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer font-pokemon uppercase tracking-wider ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-red-600/30 border-b-2 border-red-800'
              }`}
            >
              {saving ? (
                <PokeballIcon className="w-4 h-4" spinning={true} />
              ) : savedSuccess ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{savedSuccess ? '¡Guardado!' : saving ? 'Guardando...' : 'Guardar Desafío'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Editor Main Layout */}
      <div className="max-w-7xl w-full mx-auto px-4 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar: Questions List with Reordering */}
        <aside className="w-full lg:w-72 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 font-pokemon">
              Rondas ({quiz.questions.length})
            </h3>
            <span className="text-[10px] font-pixel text-slate-400">POKÉDEX</span>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
            {quiz.questions.map((q, idx) => {
              const isActive = idx === activeQuestionIdx;
              return (
                <div
                  key={q.id || idx}
                  onClick={() => setActiveQuestionIdx(idx)}
                  className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all flex items-center justify-between gap-2 group ${
                    isActive
                      ? 'bg-red-950/40 border-amber-400 shadow-md shadow-red-950/50'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black shrink-0 font-pokemon ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate max-w-[110px] font-pokemon">
                        {q.text || 'Sin texto'}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5 text-amber-400" />
                          {q.timeLimit}s
                        </span>
                        {q.image && <span className="text-amber-300 font-bold">📷 Imagen</span>}
                      </div>
                    </div>
                  </div>

                  {/* Reorder and management icons */}
                  <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => moveQuestion(idx, 'up', e)}
                      disabled={idx === 0}
                      title="Mover arriba"
                      className="p-1 hover:text-amber-300 text-slate-400 disabled:opacity-20"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => moveQuestion(idx, 'down', e)}
                      disabled={idx === quiz.questions.length - 1}
                      title="Mover abajo"
                      className="p-1 hover:text-amber-300 text-slate-400 disabled:opacity-20"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => duplicateQuestion(idx, e)}
                      title="Duplicar"
                      className="p-1 hover:text-amber-300 text-slate-400"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => deleteQuestion(idx, e)}
                      title="Eliminar"
                      className="p-1 hover:text-rose-400 text-slate-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={addQuestion}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-red-500/40 hover:border-amber-400 bg-slate-900/60 hover:bg-red-950/20 text-slate-300 hover:text-amber-300 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-pokemon uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Añadir Pregunta</span>
          </button>
        </aside>

        {/* Main Editor Panel */}
        <main className="flex-1 bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-black flex items-center justify-center text-sm shadow-md font-pokemon">
                {activeQuestionIdx + 1}
              </span>
              <div>
                <span className="text-sm font-black text-white font-pokemon uppercase block">Editar Pregunta</span>
                <span className="text-[10px] text-slate-400 font-pixel">PARÁMETROS DE COMBATE</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400 font-pokemon">Tiempo:</span>
                <select
                  value={currentQuestion.timeLimit}
                  onChange={(e) => updateCurrentQuestion({ timeLimit: Number(e.target.value) })}
                  className="bg-transparent text-amber-300 font-black focus:outline-none cursor-pointer font-pokemon"
                >
                  <option value={10} className="bg-slate-900 text-white">10 seg</option>
                  <option value={15} className="bg-slate-900 text-white">15 seg</option>
                  <option value={20} className="bg-slate-900 text-white">20 seg</option>
                  <option value={30} className="bg-slate-900 text-white">30 seg</option>
                  <option value={45} className="bg-slate-900 text-white">45 seg</option>
                  <option value={60} className="bg-slate-900 text-white">60 seg</option>
                </select>
              </div>

              <div className="flex rounded-xl bg-slate-950 border border-slate-800 p-0.5 text-xs font-pokemon">
                <button
                  type="button"
                  onClick={setFourOptions}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    currentQuestion.options.length > 2
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  4 Opciones
                </button>
                <button
                  type="button"
                  onClick={setTrueFalseOptions}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    currentQuestion.options.length === 2
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  V/F
                </button>
              </div>
            </div>
          </div>

          {/* Question Text Input */}
          <div>
            <label className="block text-xs font-black text-amber-400 uppercase tracking-wider mb-2 font-pokemon">
              Enunciado de la Pregunta
            </label>
            <textarea
              rows={2}
              value={currentQuestion.text}
              onChange={(e) => updateCurrentQuestion({ text: e.target.value })}
              placeholder="Ej. ¿A qué tipo elemental pertenece este Pokémon?"
              className="w-full text-base sm:text-lg font-bold bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-all resize-none font-pokemon"
            />
          </div>

          {/* UNLIMITED IMAGE UPLOAD SECTION */}
          <div className="bg-slate-950/80 border-2 border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <PokeballIcon className="w-4 h-4" />
                <span className="text-xs font-black text-white uppercase tracking-wider font-pokemon">
                  Imagen / Silueta de la Pregunta
                </span>
                <span className="text-[10px] bg-red-600 text-white font-pixel px-2 py-0.5 rounded-full shadow-sm">
                  ILIMITADO
                </span>
              </div>

              {currentQuestion.image && (
                <button
                  onClick={() => updateCurrentQuestion({ image: undefined })}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 font-pokemon"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Quitar imagen</span>
                </button>
              )}
            </div>

            {currentQuestion.image ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 max-h-64 flex items-center justify-center bg-black/50 p-2">
                <img
                  src={currentQuestion.image}
                  alt="Vista previa"
                  className="max-h-60 object-contain rounded drop-shadow"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-red-500/40 hover:border-amber-400 rounded-2xl p-6 text-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 group-hover:scale-110 flex items-center justify-center mx-auto mb-2 transition-transform">
                    <ImageIcon className="w-6 h-6 text-amber-400" />
                  </div>
                  <p className="text-xs font-black text-white font-pokemon uppercase tracking-wider">
                    Arrastra una imagen o <span className="text-amber-400 underline">haz clic para subir</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Cualquier Pokémon, mapa o foto. Sin límite de imágenes.
                  </p>
                </div>

                <div>
                  {!showUrlInput ? (
                    <button
                      onClick={() => setShowUrlInput(true)}
                      className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1.5 font-pokemon"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>O pegar enlace URL de una imagen o sprite</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="https://ejemplo.com/pokemon.png"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-pokemon"
                      />
                      <button
                        onClick={handleAddImageUrl}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black font-pokemon"
                      >
                        Aplicar
                      </button>
                      <button
                        onClick={() => setShowUrlInput(false)}
                        className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Options Grid (Answers) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-black text-amber-400 uppercase tracking-wider font-pokemon">
                Ataques y Opciones de Respuesta ({currentQuestion.options.length})
              </label>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={addIndividualOption}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 font-pokemon"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir opción</span>
                </button>
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold font-pokemon">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Marca la correcta
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.options.map((option, optIdx) => {
                const color = optionColors[optIdx % optionColors.length];
                return (
                  <div
                    key={option.id || optIdx}
                    className={`relative rounded-2xl border-2 p-3 transition-all flex items-center gap-3 ${
                      option.isCorrect
                        ? 'border-emerald-400 bg-emerald-950/40 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400'
                        : `${color.bg} border-slate-800`
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${color.badge}`}>
                      {color.icon}
                    </span>

                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionTextChange(optIdx, e.target.value)}
                      placeholder={`Escribe el ataque ${color.label}...`}
                      className="flex-1 bg-transparent text-sm font-bold text-white placeholder-slate-600 focus:outline-none font-pokemon"
                    />

                    {/* Delete option button if > 2 */}
                    {currentQuestion.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeIndividualOption(optIdx)}
                        className="p-1 hover:text-rose-400 text-slate-500 transition-colors"
                        title="Eliminar esta opción"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setCorrectOption(optIdx)}
                      className={`p-2 rounded-xl transition-all ${
                        option.isCorrect
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/50'
                          : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                      title={option.isCorrect ? 'Ataque correcto' : 'Marcar como correcto'}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation / Pokédex notes */}
          <div className="pt-1">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2 font-pokemon">
              Datos de la Pokédex / Explicación Pedagógica
            </label>
            <input
              type="text"
              value={currentQuestion.explanation || ''}
              onChange={(e) => updateCurrentQuestion({ explanation: e.target.value })}
              placeholder="Ej. 'Pikachu almacena electricidad en sus mofletes y la libera al sentirse amenazado'"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-pokemon"
            />
          </div>
        </main>
      </div>

      {/* AI ASSISTANT MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-md w-full p-6 shadow-2xl relative font-pokemon">
            <button
              onClick={() => setShowAiModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h3 className="text-lg font-black text-white uppercase">Asistente del Profesor Oak</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Escribe un tema curricular o Pokémon y generaremos preguntas con respuestas y opciones al instante.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-amber-400 uppercase font-bold mb-1">
                  Tema o Contenido
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Ej. 'Evoluciones de Eevee', 'Fotosíntesis', 'El Sistema Solar'..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleGenerateAi();
                  }}
                />
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Pokémon Iniciales', 'Evoluciones', 'Ciencias Naturales', 'Historia'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setAiTopic(sug)}
                    className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleGenerateAi}
                disabled={generatingAi || !aiTopic.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 rounded-2xl text-slate-950 font-black text-sm uppercase shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer border-b-2 border-red-800 mt-2"
              >
                {generatingAi ? (
                  <>
                    <PokeballIcon className="w-5 h-5" spinning={true} />
                    <span>Investigando en la Pokédex...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generar Preguntas ✨</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ METADATA / SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-600/70 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative font-pokemon">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <PokeballIcon className="w-6 h-6" />
              <h3 className="text-lg font-black text-white uppercase">Ajustes del Desafío</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 uppercase font-bold mb-1">Título</label>
                <input
                  type="text"
                  value={quiz.title}
                  onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 uppercase font-bold mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={quiz.description}
                  onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                  placeholder="Descripción para los alumnos..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 uppercase font-bold mb-1">Categoría / Asignatura</label>
                <input
                  type="text"
                  value={quiz.category}
                  onChange={(e) => setQuiz({ ...quiz, category: e.target.value })}
                  placeholder="Ej. Ciencias, Historia, Lengua, Pokémon..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 uppercase font-bold mb-1">Portada del Quiz</label>
                <div className="flex items-center gap-3">
                  {quiz.coverImage && (
                    <img src={quiz.coverImage} alt="Portada" className="w-14 h-14 object-cover rounded-xl border border-slate-700" />
                  )}
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 font-bold border border-slate-700"
                  >
                    Subir foto de portada
                  </button>
                  {quiz.coverImage && (
                    <button
                      type="button"
                      onClick={() => setQuiz({ ...quiz, coverImage: undefined })}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-amber-500 rounded-2xl text-white font-black text-sm uppercase shadow-lg shadow-red-600/30 mt-2"
              >
                Aceptar y Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
