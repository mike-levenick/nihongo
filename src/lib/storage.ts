import { KanaType, GROUPS, getKanaSet } from "@/data/kana";
import { Rating } from "./srs";

const STORAGE_PREFIX = "nihongo_";

export interface CharProgress {
  timesSeen: number;
  timesNailed: number;
  lastRating: string | null;
  score: number;
  trouble: number;
}

function getKey(key: string): string {
  return STORAGE_PREFIX + key;
}

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(getKey(key));
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    // Merge with fallback to handle missing fields from older data
    if (typeof fallback === "object" && fallback !== null && !Array.isArray(fallback)) {
      return { ...fallback, ...parsed };
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getKey(key), JSON.stringify(value));
  } catch {
    // localStorage full or unavailable
  }
}

const DEFAULT_PROGRESS: CharProgress = {
  timesSeen: 0,
  timesNailed: 0,
  lastRating: null,
  score: 0,
  trouble: 0,
};

export function getCharProgress(
  type: KanaType,
  romaji: string
): CharProgress {
  return safeGet(`progress_${type}_${romaji}`, { ...DEFAULT_PROGRESS });
}

export function saveCharProgress(
  type: KanaType,
  romaji: string,
  progress: CharProgress
): void {
  safeSet(`progress_${type}_${romaji}`, progress);
}

const SCORE_DELTAS: Record<Rating, number> = {
  nailed: 3,
  meh: 1,
  nope: -1,
};

const TROUBLE_DELTAS: Record<Rating, number> = {
  nailed: -1,
  meh: 2,
  nope: 5,
};

export function updateCharAfterRating(
  type: KanaType,
  romaji: string,
  rating: Rating
): CharProgress {
  const p = getCharProgress(type, romaji);
  p.timesSeen++;
  if (rating === "nailed") p.timesNailed++;
  p.lastRating = rating;
  p.score = Math.max(0, Math.min(9, p.score + SCORE_DELTAS[rating]));
  p.trouble = Math.max(0, p.trouble + TROUBLE_DELTAS[rating]);
  saveCharProgress(type, romaji, p);
  return p;
}

export function revertAndReapply(
  type: KanaType,
  romaji: string,
  oldRating: Rating,
  newRating: Rating
): CharProgress {
  const p = getCharProgress(type, romaji);
  // Undo old rating's deltas, apply new
  p.score = Math.max(0, Math.min(9, p.score - SCORE_DELTAS[oldRating] + SCORE_DELTAS[newRating]));
  p.trouble = Math.max(0, p.trouble - TROUBLE_DELTAS[oldRating] + TROUBLE_DELTAS[newRating]);
  if (oldRating === "nailed") p.timesNailed--;
  if (newRating === "nailed") p.timesNailed++;
  p.lastRating = newRating;
  saveCharProgress(type, romaji, p);
  return p;
}

export function getUnlockedGroups(type: KanaType): string[] {
  return safeGet(`unlocked_${type}`, [GROUPS[0]]);
}

export function setUnlockedGroups(type: KanaType, groups: string[]): void {
  safeSet(`unlocked_${type}`, groups);
}

export function unlockNextGroup(type: KanaType): string[] {
  const current = getUnlockedGroups(type);
  const currentIdx = GROUPS.findIndex(
    (g) => g === current[current.length - 1]
  );
  if (currentIdx < GROUPS.length - 1) {
    const next = [...current, GROUPS[currentIdx + 1]];
    setUnlockedGroups(type, next);
    return next;
  }
  return current;
}

export function isGroupMastered(type: KanaType, group: string): boolean {
  const chars = getKanaSet(type).filter((c) => c.group === group);
  if (chars.length === 0) return false;
  return chars.every((c) => {
    const p = getCharProgress(type, c.romaji);
    return p.score >= 6;
  });
}

export function getGroupScore(type: KanaType, group: string): { mastered: number; total: number } {
  const chars = getKanaSet(type).filter((c) => c.group === group);
  const mastered = chars.filter((c) => getCharProgress(type, c.romaji).score >= 6).length;
  return { mastered, total: chars.length };
}

export function getTroubleChars(type: KanaType) {
  const all = getKanaSet(type);
  return all
    .map((c) => ({ char: c, trouble: getCharProgress(type, c.romaji).trouble }))
    .filter((x) => x.trouble > 0)
    .sort((a, b) => b.trouble - a.trouble)
    .map((x) => x.char);
}

export function saveLastNav(type: KanaType | null, mode: string | null): void {
  safeSet("lastNav", { type, mode });
}

export function getLastNav(): { type: KanaType | null; mode: string | null } {
  return safeGet("lastNav", { type: null, mode: null });
}

export function checkAndUnlock(type: KanaType): string | null {
  const unlocked = getUnlockedGroups(type);
  const lastGroup = unlocked[unlocked.length - 1];
  if (isGroupMastered(type, lastGroup) && unlocked.length < GROUPS.length) {
    const nextGroupIdx = GROUPS.indexOf(lastGroup as typeof GROUPS[number]) + 1;
    const nextGroup = GROUPS[nextGroupIdx];
    unlockNextGroup(type);
    return nextGroup;
  }
  return null;
}
