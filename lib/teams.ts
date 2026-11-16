import { RegionTeam, WeatherType } from './types';

export const REGION_TEAMS: Record<
  RegionTeam,
  {
    name: RegionTeam;
    emoji: string;
    colorClass: string;
    badgeClass: string;
    barClass: string;
  }
> = {
  Kanto: {
    name: 'Kanto',
    emoji: '🔴',
    colorClass: 'text-red-400',
    badgeClass: 'bg-red-500/20 text-red-300 border-red-500/50',
    barClass: 'bg-gradient-to-r from-red-600 to-rose-400',
  },
  Johto: {
    name: 'Johto',
    emoji: '🔵',
    colorClass: 'text-sky-400',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/50',
    barClass: 'bg-gradient-to-r from-sky-600 to-cyan-400',
  },
  Hoenn: {
    name: 'Hoenn',
    emoji: '🟢',
    colorClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    barClass: 'bg-gradient-to-r from-emerald-600 to-lime-400',
  },
  Sinnoh: {
    name: 'Sinnoh',
    emoji: '🟡',
    colorClass: 'text-amber-400',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    barClass: 'bg-gradient-to-r from-amber-500 to-yellow-300',
  },
};

export const WEATHER_CONFIG: Record<
  WeatherType,
  {
    type: WeatherType;
    label: string;
    emoji: string;
    effectDesc: string;
    bannerClass: string;
  }
> = {
  sunny: {
    type: 'sunny',
    label: '☀️ Día Soleado',
    emoji: '☀️',
    effectDesc: '¡EXP x1.5 en todos los aciertos durante 25s!',
    bannerClass: 'bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-amber-500/25 border-amber-400 text-amber-200',
  },
  storm: {
    type: 'storm',
    label: '⚡ Tormenta Eléctrica',
    emoji: '⚡',
    effectDesc: '¡Cada acierto recarga un ataque PvP al instante!',
    bannerClass: 'bg-gradient-to-r from-yellow-500/25 via-sky-500/20 to-yellow-500/25 border-yellow-300 text-yellow-200',
  },
  shield: {
    type: 'shield',
    label: '🛡️ Campo Protector',
    emoji: '🛡️',
    effectDesc: '¡Escudo total! Nadie puede recibir ataques PvP durante 25s.',
    bannerClass: 'bg-gradient-to-r from-cyan-500/25 via-blue-500/25 to-cyan-500/25 border-cyan-300 text-cyan-100',
  },
  rain: {
    type: 'rain',
    label: '🌧️ Lluvia Curativa',
    emoji: '🌧️',
    effectDesc: '¡+5 segundos extra en el reloj de todos los entrenadores!',
    bannerClass: 'bg-gradient-to-r from-emerald-500/25 via-teal-500/25 to-emerald-500/25 border-emerald-400 text-emerald-100',
  },
};
