import fs from 'fs';
import os from 'os';
import path from 'path';
import { Quiz, Session } from './types';
import { INITIAL_QUIZZES } from './sample-data';

declare global {
  // eslint-disable-next-line no-var
  var __QUIZ_STORE__: Map<string, Quiz> | undefined;
  // eslint-disable-next-line no-var
  var __QUIZ_SESSIONS__: Map<string, Session> | undefined;
  // eslint-disable-next-line no-var
  var __STORAGE_DIR__: string | undefined;
}

function getWritableDataDir(): string {
  if (global.__STORAGE_DIR__) {
    return global.__STORAGE_DIR__;
  }

  const localDataDir = path.join(process.cwd(), 'data');
  try {
    if (!fs.existsSync(localDataDir)) {
      fs.mkdirSync(localDataDir, { recursive: true });
    }
    const testFile = path.join(localDataDir, '.write-test');
    fs.writeFileSync(testFile, 'ok');
    fs.unlinkSync(testFile);
    global.__STORAGE_DIR__ = localDataDir;
    return localDataDir;
  } catch {
    // Read-only filesystem (e.g., Vercel Serverless /var/task): use os.tmpdir() (/tmp)
    const tmpDataDir = path.join(os.tmpdir(), 'pokequiz-data');
    try {
      if (!fs.existsSync(tmpDataDir)) {
        fs.mkdirSync(tmpDataDir, { recursive: true });
      }
    } catch {
      // ignore
    }
    global.__STORAGE_DIR__ = tmpDataDir;
    return tmpDataDir;
  }
}

function getQuizzesFilePath(): string {
  return path.join(getWritableDataDir(), 'quizzes.json');
}

function getSessionsFilePath(): string {
  return path.join(getWritableDataDir(), 'sessions.json');
}

function initStore(): Map<string, Quiz> {
  const map = global.__QUIZ_STORE__ || new Map<string, Quiz>();
  const quizzesFile = getQuizzesFilePath();
  const bundledFile = path.join(process.cwd(), 'data', 'quizzes.json');

  try {
    if (fs.existsSync(quizzesFile)) {
      const content = fs.readFileSync(quizzesFile, 'utf-8');
      const loaded: Quiz[] = JSON.parse(content);
      loaded.forEach(q => map.set(q.id, q));
    } else if (fs.existsSync(bundledFile)) {
      const content = fs.readFileSync(bundledFile, 'utf-8');
      const loaded: Quiz[] = JSON.parse(content);
      loaded.forEach(q => map.set(q.id, q));
    }
  } catch (err) {
    console.warn('Error loading quizzes file, falling back to samples:', err);
  }

  // Ensure initial sample quizzes exist and upgrade if sample questions increased
  let updatedInitial = false;
  INITIAL_QUIZZES.forEach(q => {
    const existing = map.get(q.id);
    if (!existing || existing.questions.length < q.questions.length) {
      map.set(q.id, q);
      updatedInitial = true;
    }
  });
  if (updatedInitial) {
    saveStoreToFile(map);
  }

  global.__QUIZ_STORE__ = map;
  return map;
}

function saveStoreToFile(map: Map<string, Quiz>) {
  try {
    const arr = Array.from(map.values());
    fs.writeFileSync(getQuizzesFilePath(), JSON.stringify(arr, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist quizzes to disk:', err);
  }
}

function initSessions(): Map<string, Session> {
  const map = global.__QUIZ_SESSIONS__ || new Map<string, Session>();
  const sessionsFile = getSessionsFilePath();

  try {
    if (fs.existsSync(sessionsFile)) {
      const content = fs.readFileSync(sessionsFile, 'utf-8');
      const loaded: Session[] = JSON.parse(content);
      const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24h TTL
      loaded.forEach(s => {
        if (s.createdAt > cutoff) {
          map.set(s.pin, s);
        }
      });
    }
  } catch (err) {
    console.warn('Error reading sessions file:', err);
  }

  global.__QUIZ_SESSIONS__ = map;
  return map;
}

function saveSessionsToFile(map: Map<string, Session>) {
  try {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const arr = Array.from(map.values()).filter(s => s.createdAt > cutoff);
    fs.writeFileSync(getSessionsFilePath(), JSON.stringify(arr), 'utf-8');
  } catch (err) {
    console.warn('Could not persist sessions to disk:', err);
  }
}

// Quiz repository operations
export const QuizStore = {
  getAll(): Quiz[] {
    const store = initStore();
    return Array.from(store.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  },

  getById(id: string): Quiz | null {
    const store = initStore();
    return store.get(id) || null;
  },

  save(quiz: Quiz): Quiz {
    const store = initStore();
    quiz.updatedAt = Date.now();
    if (!quiz.createdAt) {
      quiz.createdAt = Date.now();
    }
    store.set(quiz.id, quiz);
    saveStoreToFile(store);
    return quiz;
  },

  delete(id: string): boolean {
    const store = initStore();
    const deleted = store.delete(id);
    if (deleted) {
      saveStoreToFile(store);
    }
    return deleted;
  }
};

// Live Game Session operations
export const SessionStore = {
  create(quiz: Quiz): Session {
    const sessions = initSessions();

    let pin = '';
    do {
      pin = Math.floor(100000 + Math.random() * 900000).toString();
    } while (sessions.has(pin));

    const session: Session = {
      pin,
      quizId: quiz.id,
      quizTitle: quiz.title,
      status: 'waiting',
      createdAt: Date.now(),
      questions: JSON.parse(JSON.stringify(quiz.questions)),
      players: {}
    };

    sessions.set(pin, session);
    saveSessionsToFile(sessions);
    return session;
  },

  get(pin: string): Session | null {
    const sessions = initSessions();
    return sessions.get(pin) || null;
  },

  update(session: Session): void {
    const sessions = initSessions();
    sessions.set(session.pin, session);
    saveSessionsToFile(sessions);
  },

  delete(pin: string): void {
    const sessions = initSessions();
    sessions.delete(pin);
    saveSessionsToFile(sessions);
  }
};
