export interface LeagueReward {
  rank: number;
  expPoints: number;
  regionPoints: number;
  pokemon: boolean;
  benefitCard?: string;
  summary: string;
  badges: string[];
}

export const TOP_6_REWARDS: Record<number, LeagueReward> = {
  1: {
    rank: 1,
    expPoints: 6,
    regionPoints: 6,
    pokemon: true,
    benefitCard: 'Tarjeta Buscaobjetos',
    summary: '1 Pokémon + Tarjeta Buscaobjetos + 6 pts Región + 6 EXP',
    badges: ['🐾 Pokémon', '🧭 Tarjeta Buscaobjetos', '🗺️ 6 pts Región', '⭐ 6 EXP'],
  },
  2: {
    rank: 2,
    expPoints: 5,
    regionPoints: 5,
    pokemon: true,
    benefitCard: 'Tarjeta Poción',
    summary: '1 Pokémon + Tarjeta Poción + 5 pts Región + 5 EXP',
    badges: ['🐾 Pokémon', '🧪 Tarjeta Poción', '🗺️ 5 pts Región', '⭐ 5 EXP'],
  },
  3: {
    rank: 3,
    expPoints: 3,
    regionPoints: 3,
    pokemon: true,
    summary: '1 Pokémon + 3 pts Región + 3 EXP',
    badges: ['🐾 Pokémon', '🗺️ 3 pts Región', '⭐ 3 EXP'],
  },
  4: {
    rank: 4,
    expPoints: 2,
    regionPoints: 2,
    pokemon: false,
    summary: '2 pts Región + 2 EXP',
    badges: ['🗺️ 2 pts Región', '⭐ 2 EXP'],
  },
  5: {
    rank: 5,
    expPoints: 1,
    regionPoints: 1,
    pokemon: false,
    summary: '1 pt Región + 1 EXP',
    badges: ['🗺️ 1 pt Región', '⭐ 1 EXP'],
  },
  6: {
    rank: 6,
    expPoints: 1,
    regionPoints: 1,
    pokemon: false,
    summary: '1 pt Región + 1 EXP',
    badges: ['🗺️ 1 pt Región', '⭐ 1 EXP'],
  },
};

export function getRewardForRank(rankOneBased: number): LeagueReward | null {
  return TOP_6_REWARDS[rankOneBased] || null;
}
