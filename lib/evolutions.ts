const art = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export interface EvolutionStageInfo {
  stage: 1 | 2 | 3;
  name: string;
  artwork: string;
}

export interface BossPreset {
  id: string;
  name: string;
  title: string;
  artwork: string;
  accentClass: string;
}

export const BOSS_PRESETS: BossPreset[] = [
  {
    id: 'mewtwo',
    name: 'Mewtwo Legendario',
    title: 'Guardián Psíquico',
    artwork: art(150),
    accentClass: 'from-fuchsia-600 via-purple-600 to-indigo-700',
  },
  {
    id: 'rayquaza',
    name: 'Rayquaza Celestial',
    title: 'Dragón de los Cielos',
    artwork: art(384),
    accentClass: 'from-emerald-600 via-teal-600 to-cyan-700',
  },
  {
    id: 'charizard',
    name: 'Charizard Gigamax',
    title: 'Señor de las Llamas',
    artwork: art(6),
    accentClass: 'from-red-600 via-orange-600 to-amber-600',
  },
  {
    id: 'articuno',
    name: 'Articuno Supremo',
    title: 'Ave de Hielo Eterno',
    artwork: art(144),
    accentClass: 'from-sky-500 via-blue-600 to-indigo-700',
  },
];

// Evolution chains mapped by initial avatar artwork URL (or avatar id)
export const EVOLUTION_CHAINS: Record<string, [EvolutionStageInfo, EvolutionStageInfo, EvolutionStageInfo]> = {
  pikachu: [
    { stage: 1, name: 'Pikachu', artwork: art(25) },
    { stage: 2, name: 'Raichu', artwork: art(26) },
    { stage: 3, name: 'Raichu Alola', artwork: art(10100) },
  ],
  charmander: [
    { stage: 1, name: 'Charmander', artwork: art(4) },
    { stage: 2, name: 'Charmeleon', artwork: art(5) },
    { stage: 3, name: 'Charizard', artwork: art(6) },
  ],
  squirtle: [
    { stage: 1, name: 'Squirtle', artwork: art(7) },
    { stage: 2, name: 'Wartortle', artwork: art(8) },
    { stage: 3, name: 'Blastoise', artwork: art(9) },
  ],
  bulbasaur: [
    { stage: 1, name: 'Bulbasaur', artwork: art(1) },
    { stage: 2, name: 'Ivysaur', artwork: art(2) },
    { stage: 3, name: 'Venusaur', artwork: art(3) },
  ],
  eevee: [
    { stage: 1, name: 'Eevee', artwork: art(133) },
    { stage: 2, name: 'Jolteon', artwork: art(135) },
    { stage: 3, name: 'Sylveon', artwork: art(700) },
  ],
  gengar: [
    { stage: 1, name: 'Gengar', artwork: art(94) },
    { stage: 2, name: 'Mega Gengar', artwork: art(10038) },
    { stage: 3, name: 'Gengar Gigamax', artwork: art(10202) },
  ],
  snorlax: [
    { stage: 1, name: 'Snorlax', artwork: art(143) },
    { stage: 2, name: 'Snorlax Gigamax', artwork: art(10206) },
    { stage: 3, name: 'Snorlax Legendario', artwork: art(10206) },
  ],
  lucario: [
    { stage: 1, name: 'Lucario', artwork: art(448) },
    { stage: 2, name: 'Mega Lucario', artwork: art(10059) },
    { stage: 3, name: 'Lucario Aura Suprema', artwork: art(10059) },
  ],
  jigglypuff: [
    { stage: 1, name: 'Jigglypuff', artwork: art(39) },
    { stage: 2, name: 'Wigglytuff', artwork: art(40) },
    { stage: 3, name: 'Wigglytuff Estrella', artwork: art(40) },
  ],
  mewtwo: [
    { stage: 1, name: 'Mewtwo', artwork: art(150) },
    { stage: 2, name: 'Mega Mewtwo X', artwork: art(10043) },
    { stage: 3, name: 'Mega Mewtwo Y', artwork: art(10044) },
  ],
  piplup: [
    { stage: 1, name: 'Piplup', artwork: art(393) },
    { stage: 2, name: 'Prinplup', artwork: art(394) },
    { stage: 3, name: 'Empoleon', artwork: art(395) },
  ],
  rowlet: [
    { stage: 1, name: 'Rowlet', artwork: art(722) },
    { stage: 2, name: 'Dartrix', artwork: art(723) },
    { stage: 3, name: 'Decidueye', artwork: art(724) },
  ],
};

export function findChainByArtwork(currentArtwork: string): [EvolutionStageInfo, EvolutionStageInfo, EvolutionStageInfo] | null {
  for (const chain of Object.values(EVOLUTION_CHAINS)) {
    if (chain.some((s) => s.artwork === currentArtwork)) {
      return chain;
    }
  }
  return null;
}

export function getTargetStageForCorrectCount(correctCount: number): 1 | 2 | 3 {
  if (correctCount >= 8) return 3;
  if (correctCount >= 4) return 2;
  return 1;
}
