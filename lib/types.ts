export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  image?: string; // Base64 data URL or external URL (UNLIMITED)
  timeLimit: number; // In seconds (10, 15, 20, 30, 45, 60)
  points: number; // 1000 standard
  options: QuestionOption[];
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  coverImage?: string;
  createdAt: number;
  updatedAt: number;
  questions: Question[];
}

export interface PlayerAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  scoreEarned: number;
  timeSpent: number;
  answeredAt: number;
}

export interface ActiveAttackEffect {
  id: string;
  type: 'paralyze' | 'steal_time';
  fromNickname: string;
  fromAvatar: string;
  createdAt: number;
  expiresAt: number;
}

export interface BattleLogEntry {
  id: string;
  text: string;
  type: 'paralyze' | 'steal_time';
  createdAt: number;
}

export type RegionTeam = 'Kanto' | 'Johto' | 'Hoenn' | 'Sinnoh';

export type WeatherType = 'sunny' | 'storm' | 'shield' | 'rain';

export interface ActiveWeather {
  type: WeatherType;
  activatedAt: number;
  expiresAt: number;
}

export interface Player {
  id: string;
  nickname: string;
  avatar: string;
  team?: RegionTeam;
  score: number;
  streak: number;
  highestStreak: number;
  currentQuestionIndex: number;
  answers: PlayerAnswer[];
  isFinished: boolean;
  finishedAt?: number;
  joinedAt: number;
  lastActiveAt: number;
  attackCharges?: number;
  activeEffect?: ActiveAttackEffect | null;
}

export type SessionStatus = 'waiting' | 'active' | 'finished';

export interface SessionSettings {
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showExplanations?: boolean;
  powerUpsEnabled?: boolean;
  pvpAttacksEnabled?: boolean;
  teamsEnabled?: boolean;
  paceMode?: 'free' | 'teacher';
  questionDuration?: number; // 0 = default per question, >0 = override seconds, -1 = no timer
}

export interface Session {
  pin: string;
  quizId: string;
  quizTitle: string;
  status: SessionStatus;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
  questions: Question[];
  players: Record<string, Player>;
  settings?: SessionSettings;
  battleLog?: BattleLogEntry[];
  activeWeather?: ActiveWeather | null;
  teacherCurrentIndex?: number;
  questionClosed?: boolean;
  bonusTimePulse?: { id: string; seconds: number; createdAt: number } | null;
}
