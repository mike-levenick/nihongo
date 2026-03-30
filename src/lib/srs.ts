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
  const target = correct.toLowerCase();
  if (normalized === target) return "nailed";
  if (aliases?.some((a) => normalized === a.toLowerCase())) return "nailed";
  if (normalized.length > 0 && target.startsWith(normalized[0])) return "meh";
  if (aliases?.some((a) => normalized.length > 0 && a.toLowerCase().startsWith(normalized[0]))) return "meh";
  return "nope";
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
