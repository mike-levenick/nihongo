import { KanaChar } from "@/data/kana";

export type Rating = "nailed" | "meh" | "nope";

export interface CardState {
  card: KanaChar;
  timesSeen: number;
  timesNailed: number;
}

function randInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getReinsertOffset(rating: Rating): number {
  switch (rating) {
    case "nailed":
      return randInRange(20, 30);
    case "meh":
      return randInRange(5, 10);
    case "nope":
      return randInRange(1, 3);
  }
}

export function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function buildQueue(chars: KanaChar[]): CardState[] {
  return shuffle(chars).map((card) => ({
    card,
    timesSeen: 0,
    timesNailed: 0,
  }));
}

export function gradeAnswer(input: string, correct: string, aliases?: string[]): Rating {
  const normalized = input.trim().toLowerCase();
  const candidates = [correct, ...(aliases ?? [])].map((c) => c.toLowerCase());

  if (candidates.some((c) => c === normalized)) return "nailed";
  if (normalized.length > 0 && candidates.some((c) => c.startsWith(normalized[0]))) return "meh";
  return "nope";
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function gradeWordAnswer(input: string, correct: string, aliases?: string[]): Rating {
  const normalized = input.trim().toLowerCase();
  const candidates = [correct, ...(aliases ?? [])].map((c) => c.toLowerCase());

  const minDist = Math.min(...candidates.map((c) => levenshtein(normalized, c)));
  if (minDist === 0) return "nailed";
  if (minDist <= 2) return "meh";
  return "nope";
}

export interface DiffChar {
  char: string;
  correct: boolean;
}

export function diffAnswer(input: string, correct: string): DiffChar[] {
  const result: DiffChar[] = [];
  const len = Math.max(input.length, correct.length);
  for (let i = 0; i < len; i++) {
    if (i < input.length) {
      result.push({
        char: input[i],
        correct: i < correct.length && input[i] === correct[i],
      });
    }
  }
  return result;
}

export function rateCard(
  queue: CardState[],
  currentIndex: number,
  rating: Rating
): CardState[] {
  const newQueue = [...queue];
  const [rated] = newQueue.splice(currentIndex, 1);

  rated.timesSeen++;
  if (rating === "nailed") {
    rated.timesNailed++;
  }

  const offset = getReinsertOffset(rating);
  const insertAt = Math.min(currentIndex + offset, newQueue.length);

  newQueue.splice(insertAt, 0, rated);
  return newQueue;
}
