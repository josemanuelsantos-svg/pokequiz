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

export interface Player {
  id: string;
  nickname: string;
  avatar: string;
  score: number;
  streak: number;
  highestStreak: number;
  currentQuestionIndex: number;
  answers: PlayerAnswer[];
  isFinished: boolean;
  finishedAt?: number;
  joinedAt: number;
  lastActiveAt: number;
}

export type SessionStatus = 'waiting' | 'active' | 'finished';

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
}
