export interface LeagueReward {
  rank: number;
  expPoints: number;
  pokemon: boolean;
  benefitCard?: string;
  summary: string;
  badges: string[];
}

export const TOP_6_REWARDS: Record<number, LeagueReward> = {
  1: {
    rank: 1,
    expPoints: 6,
    pokemon: true,
    benefitCard: 'Tarjeta de beneficio',
    summary: '6 Puntos de Experiencia + 1 Pokémon + Tarjeta de beneficio',
    badges: ['⭐ 6 Puntos EXP', '🐾 +1 Pokémon', '🃏 Tarjeta de beneficio'],
  },
  2: {
    rank: 2,
    expPoints: 5,
    pokemon: true,
    benefitCard: 'Tarjeta de beneficio',
    summary: '5 Puntos de Experiencia + 1 Pokémon + Tarjeta de beneficio',
    badges: ['⭐ 5 Puntos EXP', '🐾 +1 Pokémon', '🃏 Tarjeta de beneficio'],
  },
  3: {
    rank: 3,
    expPoints: 3,
    pokemon: false,
    summary: '3 Puntos de Experiencia',
    badges: ['⭐ 3 Puntos EXP'],
  },
  4: {
    rank: 4,
    expPoints: 2,
    pokemon: false,
    summary: '2 Puntos de Experiencia',
    badges: ['⭐ 2 Puntos EXP'],
  },
  5: {
    rank: 5,
    expPoints: 1,
    pokemon: false,
    summary: '1 Punto de Experiencia',
    badges: ['⭐ 1 Punto EXP'],
  },
  6: {
    rank: 6,
    expPoints: 1,
    pokemon: false,
    summary: '1 Punto de Experiencia',
    badges: ['⭐ 1 Punto EXP'],
  },
};

export function getRewardForRank(rankOneBased: number): LeagueReward | null {
  return TOP_6_REWARDS[rankOneBased] || null;
}
