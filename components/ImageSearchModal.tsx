'use client';

import React, { useState, useEffect } from 'react';
import { Search, Globe, Sparkles, X, Check, ClipboardPaste, Link as LinkIcon, Loader2 } from 'lucide-react';
import { PokeballIcon } from './Pokeball';
import { processImageFile } from '@/lib/image-upload';

interface WebImageResult {
  id: string;
  title: string;
  thumbUrl: string;
  fullUrl: string;
  source: string;
}

interface PokemonEntry {
  id: number;
  name: string;
}

const POPULAR_POKEMON: PokemonEntry[] = [
  { id: 25, name: 'Pikachu' },
  { id: 6, name: 'Charizard' },
  { id: 1, name: 'Bulbasaur' },
  { id: 4, name: 'Charmander' },
  { id: 7, name: 'Squirtle' },
  { id: 9, name: 'Blastoise' },
  { id: 3, name: 'Venusaur' },
  { id: 133, name: 'Eevee' },
  { id: 150, name: 'Mewtwo' },
  { id: 151, name: 'Mew' },
  { id: 143, name: 'Snorlax' },
  { id: 94, name: 'Gengar' },
  { id: 448, name: 'Lucario' },
  { id: 384, name: 'Rayquaza' },
  { id: 149, name: 'Dragonite' },
  { id: 130, name: 'Gyarados' },
  { id: 131, name: 'Lapras' },
  { id: 59, name: 'Arcanine' },
  { id: 65, name: 'Alakazam' },
  { id: 68, name: 'Machamp' },
  { id: 39, name: 'Jigglypuff' },
  { id: 52, name: 'Meowth' },
  { id: 54, name: 'Psyduck' },
  { id: 134, name: 'Vaporeon' },
  { id: 135, name: 'Jolteon' },
  { id: 136, name: 'Flareon' },
  { id: 196, name: 'Espeon' },
  { id: 197, name: 'Umbreon' },
  { id: 470, name: 'Leafeon' },
  { id: 471, name: 'Glaceon' },
  { id: 700, name: 'Sylveon' },
  { id: 144, name: 'Articuno' },
  { id: 145, name: 'Zapdos' },
  { id: 146, name: 'Moltres' },
  { id: 249, name: 'Lugia' },
  { id: 250, name: 'Ho-Oh' },
  { id: 248, name: 'Tyranitar' },
  { id: 282, name: 'Gardevoir' },
  { id: 257, name: 'Blaziken' },
  { id: 382, name: 'Kyogre' },
  { id: 383, name: 'Groudon' },
  { id: 445, name: 'Garchomp' },
  { id: 658, name: 'Greninja' },
  { id: 778, name: 'Mimikyu' },
  { id: 815, name: 'Cinderace' },
  { id: 906, name: 'Sprigatito' },
  { id: 909, name: 'Fuecoco' },
  { id: 912, name: 'Quaxly' },
];

const EDUCATIONAL_TOPICS = [
  'Sistema Solar',
  'Volcán',
  'Reloj de agujas',
  'Pizza fracciones',
  'Mapa de España',
  'León mamífero',
  'Cuerpo humano',
  'Castillo medieval',
  'Polígonos geometría',
  'Bosque naturaleza',
  'Instrumentos musicales',
  'Deportes olímpicos',
];

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  initialQuery?: string;
}

export function ImageSearchModal({
  isOpen,
  onClose,
  onSelectImage,
  initialQuery = '',
}: ImageSearchModalProps) {
  const [activeTab, setActiveTab] = useState<'web' | 'pokedex' | 'paste'>('web');

  // Web search state
  const [webQuery, setWebQuery] = useState(initialQuery || 'Sistema Solar');
  const [webResults, setWebResults] = useState<WebImageResult[]>([]);
  const [loadingWeb, setLoadingWeb] = useState(false);
  const [webError, setWebError] = useState('');

  // Pokedex search state
  const [pokeQuery, setPokeQuery] = useState('');
  const [allPokemonList, setAllPokemonList] = useState<PokemonEntry[]>(POPULAR_POKEMON);
  const [artStyle, setArtStyle] = useState<'official' | 'home' | 'sprite'>('official');

  // Direct URL / Clipboard state
  const [directUrl, setDirectUrl] = useState('');
  const [pasteStatus, setPasteStatus] = useState('');

  // Load full Pokémon index once for instant search by name among all 1025 Pokémon
  useEffect(() => {
    if (!isOpen) return;
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.results)) {
          const parsed: PokemonEntry[] = data.results.map(
            (item: { name: string; url: string }, idx: number) => ({
              id: idx + 1,
              name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
            })
          );
          setAllPokemonList(parsed);
        }
      })
      .catch(() => {
        // Fallback to POPULAR_POKEMON if offline
      });
  }, [isOpen]);

  const performWebSearch = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setLoadingWeb(true);
    setWebError('');
    try {
      const res = await fetch(`/api/image-search?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.results)) {
        setWebResults(data.results);
        if (data.results.length === 0) {
          setWebError('No se encontraron imágenes para esa búsqueda. Prueba con otra palabra (ej. "volcán", "león", "planetas").');
        }
      } else {
        setWebError('Error al buscar imágenes en internet.');
      }
    } catch {
      setWebError('Error de conexión con el buscador de imágenes.');
    } finally {
      setLoadingWeb(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'web' && webResults.length === 0) {
      performWebSearch(webQuery || 'Sistema Solar');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeTab]);

  // Listen for Ctrl+V / Cmd+V when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const handleGlobalPaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            setPasteStatus('Procesando imagen pegada...');
            const compressed = await processImageFile(file);
            onSelectImage(compressed);
            onClose();
            return;
          }
        }
      }

      const text = e.clipboardData?.getData('text/plain')?.trim();
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
        if (activeTab === 'paste') {
          setDirectUrl(text);
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [isOpen, activeTab, onSelectImage, onClose]);

  if (!isOpen) return null;

  const getPokemonImageUrl = (id: number) => {
    if (artStyle === 'home') {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
    }
    if (artStyle === 'sprite') {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  const filteredPokemon = pokeQuery.trim()
    ? allPokemonList
        .filter(
          (p) =>
            p.name.toLowerCase().includes(pokeQuery.trim().toLowerCase()) ||
            String(p.id) === pokeQuery.trim()
        )
        .slice(0, 48)
    : POPULAR_POKEMON;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-pokemon">
        {/* Top Bar */}
        <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <PokeballIcon className="w-6 h-6" />
            <div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                Buscador de Imágenes Integrado
              </h3>
              <p className="text-[11px] text-slate-400">
                Elige una imagen de internet o de la Pokédex en 1 clic sin descargar nada a tu ordenador
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 pt-2 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('web')}
            className={`px-4 py-2.5 rounded-t-2xl text-xs font-black uppercase flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'web'
                ? 'bg-slate-900 text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>🌐 Buscar en Internet (Educativo)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pokedex')}
            className={`px-4 py-2.5 rounded-t-2xl text-xs font-black uppercase flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'pokedex'
                ? 'bg-slate-900 text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>⚡ Galería Pokédex (1.025 Pokémon)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`px-4 py-2.5 rounded-t-2xl text-xs font-black uppercase flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'paste'
                ? 'bg-slate-900 text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <ClipboardPaste className="w-4 h-4" />
            <span>📋 Pegar con Ctrl+V / Google</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: WEB IMAGE SEARCH */}
          {activeTab === 'web' && (
            <>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={webQuery}
                    onChange={(e) => setWebQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') performWebSearch(webQuery);
                    }}
                    placeholder="Escribe qué imagen buscas: ej. 'volcán', 'sistema solar', 'reloj', 'castillo', 'león'..."
                    className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => performWebSearch(webQuery)}
                  disabled={loadingWeb}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  {loadingWeb ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Buscar Fotos</span>
                </button>
              </div>

              {/* Quick suggestion chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 mr-1">Búsquedas rápidas:</span>
                {EDUCATIONAL_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      setWebQuery(topic);
                      performWebSearch(topic);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 border border-slate-700 transition-colors cursor-pointer font-bold"
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Results Grid */}
              {loadingWeb ? (
                <div className="py-16 flex flex-col items-center justify-center text-amber-300 gap-3">
                  <PokeballIcon className="w-10 h-10" spinning={true} />
                  <p className="text-sm font-bold">Buscando imágenes en internet...</p>
                </div>
              ) : webError ? (
                <div className="py-12 text-center text-slate-400 text-sm bg-slate-950/60 rounded-2xl border border-slate-800 p-6">
                  {webError}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {webResults.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => {
                        onSelectImage(img.fullUrl);
                        onClose();
                      }}
                      className="group relative bg-slate-950 border-2 border-slate-800 hover:border-amber-400 rounded-2xl overflow-hidden flex flex-col text-left transition-all hover:scale-[1.02] cursor-pointer shadow-md"
                    >
                      <div className="h-32 w-full bg-slate-900 flex items-center justify-center p-2 overflow-hidden">
                        <img
                          src={img.thumbUrl}
                          alt={img.title}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-2 bg-slate-900/90 border-t border-slate-800 w-full flex items-center justify-between gap-1">
                        <span className="text-[11px] text-slate-200 font-bold truncate block">
                          {img.title}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 shrink-0">
                          Elegir
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* TAB 2: POKEDEX GALLERY */}
          {activeTab === 'pokedex' && (
            <>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={pokeQuery}
                    onChange={(e) => setPokeQuery(e.target.value)}
                    placeholder="Escribe el nombre o número de cualquier Pokémon (ej. Pikachu, Charizard, 151)..."
                    className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="flex rounded-xl bg-slate-950 border border-slate-800 p-1 text-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setArtStyle('official')}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                      artStyle === 'official' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Arte Oficial HD
                  </button>
                  <button
                    type="button"
                    onClick={() => setArtStyle('home')}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                      artStyle === 'home' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    3D Home
                  </button>
                  <button
                    type="button"
                    onClick={() => setArtStyle('sprite')}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                      artStyle === 'sprite' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Pixel Retro
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {filteredPokemon.map((poke) => {
                  const imgUrl = getPokemonImageUrl(poke.id);
                  return (
                    <button
                      key={poke.id}
                      type="button"
                      onClick={() => {
                        onSelectImage(imgUrl);
                        onClose();
                      }}
                      className="group bg-slate-950 border-2 border-slate-800 hover:border-amber-400 rounded-2xl p-2.5 flex flex-col items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                    >
                      <div className="w-20 h-20 flex items-center justify-center">
                        <img
                          src={imgUrl}
                          alt={poke.name}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain drop-shadow group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-pixel">#{poke.id}</span>
                      <span className="text-xs font-black text-white group-hover:text-amber-300 truncate max-w-full">
                        {poke.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* TAB 3: PASTE FROM CLIPBOARD OR GOOGLE IMAGES */}
          {activeTab === 'paste' && (
            <div className="space-y-5 py-2">
              <div className="bg-amber-500/10 border-2 border-dashed border-amber-400/60 rounded-3xl p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto">
                  <ClipboardPaste className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-white uppercase">
                  ¡Pega cualquier imagen directamente con Ctrl+V (o Cmd+V)!
                </h4>
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  1. Ve a <strong>Google Imágenes</strong>, un PDF o Word y haz clic derecho en cualquier foto:{' '}
                  <span className="text-amber-300 font-bold">&ldquo;Copiar imagen&rdquo;</span>.<br />
                  2. Vuelve a esta ventana y pulsa <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-600 text-amber-300">Ctrl + V</kbd> (o <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-600 text-amber-300">Cmd + V</kbd> en Mac). ¡Se insertará al instante sin descargar nada!
                </p>
                {pasteStatus && (
                  <p className="text-xs text-emerald-400 font-bold pt-2">{pasteStatus}</p>
                )}
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <label className="block text-xs font-black text-amber-400 uppercase flex items-center gap-1.5">
                  <LinkIcon className="w-4 h-4" />
                  <span>O pega la dirección web (URL) de una imagen:</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={directUrl}
                    onChange={(e) => setDirectUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    disabled={!directUrl.trim()}
                    onClick={() => {
                      if (directUrl.trim()) {
                        onSelectImage(directUrl.trim());
                        onClose();
                      }
                    }}
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Usar Imagen</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
