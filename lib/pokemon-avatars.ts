export interface PokemonAvatar {
  id: string;
  name: string;
  artwork: string;
  type: string;
  badgeColor: string;
}

export const POKEMON_AVATARS: PokemonAvatar[] = [
  {
    id: 'pikachu',
    name: 'Pikachu',
    artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    type: 'Eléctrico',
    badgeColor: 'bg-amber-400 text-slate-950'
  },
  {
    id: 'charmander',
    name: 'Charmander',
    artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    type: 'Fuego',
    badgeColor: 'bg-orange-500 text-white'
  },
  {
    id: 'squirtle',
    name: 'Squirtle',
    artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
    type: 'Agua',
    badgeColor: 'bg-blue-500 text-white'
  },
  {
    id: 'bulbasaur',
    name: 'Bulbasaur',
    artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    type: 'Planta',
    badgeColor: 'bg-emerald-500 text-white'
  },
  {
    id: 'eevee',
    name: 'Eevee',
    artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
    type: 'Normal',
    badgeColor: 'bg-amber-700 text-white'
  },
  {
    id: 'gengar',
    name: 'Gengar',
    artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
    type: 'Fantasma',
    badgeColor: 'bg-purple-600 text-white'
  },
  {
    id: 'snorlax',
    name: 'Snorlax',
    artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
    type: 'Normal',
    badgeColor: 'bg-teal-700 text-white'
  },
  {
    id: 'lucario',
    name: 'Lucario',
    artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png',
    type: 'Lucha',
    badgeColor: 'bg-sky-600 text-white'
  },
  {
    id: 'jigglypuff',
    name: 'Jigglypuff',
    artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png',
    type: 'Hada',
    badgeColor: 'bg-pink-400 text-slate-950'
  },
  {
    id: 'mewtwo',
    name: 'Mewtwo',
    artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
    type: 'Psíquico',
    badgeColor: 'bg-fuchsia-600 text-white'
  },
  {
    id: 'piplup',
    name: 'Piplup',
    artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/393.png',
    type: 'Agua',
    badgeColor: 'bg-cyan-500 text-white'
  },
  {
    id: 'rowlet',
    name: 'Rowlet',
    artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/722.png',
    type: 'Planta',
    badgeColor: 'bg-lime-600 text-white'
  }
];
