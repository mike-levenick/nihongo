"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { KanaType, getCharsByGroups, GROUP_LABELS } from "@/data/kana";
import { buildQueue, rateCard, gradeAnswer, Rating, CardState } from "@/lib/srs";
import { updateCharAfterRating, revertAndReapply, checkAndUnlock } from "@/lib/storage";
import FlashCard from "@/components/FlashCard";
import ProgressBar from "@/components/ProgressBar";

type Phase = "input" | "result";

function downgradeRating(r: Rating): Rating {
  if (r === "nailed") return "meh";
  if (r === "meh") return "nope";
  return "nope";
}

function StudySession() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = (searchParams.get("type") as KanaType) || "hiragana";
  const groups = searchParams.get("groups")?.split(",") || ["vowel"];
  const mode = searchParams.get("mode") || "study";

  const [queue, setQueue] = useState<CardState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("input");
  const [inputValue, setInputValue] = useState("");
  const [lastResult, setLastResult] = useState<{ rating: Rating; userAnswer: string } | null>(null);
  const [cardsCompleted, setCardsCompleted] = useState(0);
  const [totalCards, setTotalCards] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);
  const [stats, setStats] = useState({ nailed: 0, meh: 0, nope: 0 });
  const [unlockedDuring, setUnlockedDuring] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const preRateQueueRef = useRef<CardState[]>([]);
  const preRateIndexRef = useRef(0);
  const currentCardRef = useRef<CardState | null>(null);
  const currentRatingRef = useRef<Rating | null>(null);

  useEffect(() => {
    const chars = getCharsByGroups(type, groups);
    const q = buildQueue(chars);
    setQueue(q);
    setTotalCards(chars.length);
  }, [type, groups.join(",")]);

  useEffect(() => {
    if (phase === "input") {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [phase, currentIndex]);

  const advanceToNext = useCallback(
    (newQueue: CardState[], idx: number, completed: number) => {
      if (completed >= totalCards * 3) {
        setSessionDone(true);
        return;
      }
      setQueue(newQueue);
      setCurrentIndex(Math.min(idx, newQueue.length - 1));
      setLastResult(null);
      setInputValue("");
      setPhase("input");
    },
    [totalCards]
  );

  const handleSubmit = useCallback(() => {
    if (queue.length === 0) return;

    // If in result phase, handle downgrade
    if (phase === "result" && lastResult && lastResult.rating !== "nope") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      const oldRating = lastResult.rating;
      const newRating = downgradeRating(oldRating);
      const card = currentCardRef.current!;

      // Fix stats
      setStats((s) => ({
        ...s,
        [oldRating]: s[oldRating as keyof typeof s] - 1,
        [newRating]: s[newRating as keyof typeof s] + 1,
      }));

      // Fix stored progress
      revertAndReapply(type, card.card.romaji, oldRating, newRating);

      // Re-rate with downgraded rating from pre-rate state
      const newQueue = rateCard(preRateQueueRef.current, preRateIndexRef.current, newRating);

      // Check auto-unlock
      if (mode === "learning") {
        const unlocked = checkAndUnlock(type);
        if (unlocked) {
          setUnlockedDuring((prev) =>
            prev.includes(unlocked) ? prev : [...prev, unlocked]
          );
        }
      }

      advanceToNext(newQueue, preRateIndexRef.current, cardsCompleted);
      return;
    }

    if (phase !== "input") return;

    const card = queue[currentIndex];
    const rating = gradeAnswer(inputValue, card.card.romaji);

    // Store pre-rate state for potential downgrade
    preRateQueueRef.current = queue;
    preRateIndexRef.current = currentIndex;
    currentCardRef.current = card;
    currentRatingRef.current = rating;

    setLastResult({ rating, userAnswer: inputValue });
    setPhase("result");
    setStats((s) => ({ ...s, [rating]: s[rating] + 1 }));
    setCardsCompleted((c) => c + 1);

    // Save progress with score
    updateCharAfterRating(type, card.card.romaji, rating);

    // Check auto-unlock
    if (mode === "learning") {
      const unlocked = checkAndUnlock(type);
      if (unlocked) {
        setUnlockedDuring((prev) =>
          prev.includes(unlocked) ? prev : [...prev, unlocked]
        );
      }
    }

    // Update queue
    const newQueue = rateCard(queue, currentIndex, rating);

    // Auto-advance after delay
    timeoutRef.current = setTimeout(() => {
      advanceToNext(newQueue, currentIndex, cardsCompleted + 1);
    }, 1500);
  }, [queue, currentIndex, inputValue, type, cardsCompleted, phase, lastResult, mode, advanceToNext]);

  // Listen for Enter during result phase (input is disabled so form won't fire)
  useEffect(() => {
    if (phase !== "result") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, handleSubmit]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (queue.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500">
        Loading...
      </div>
    );
  }

  if (sessionDone) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        <h1 className="text-3xl font-bold">Session Complete</h1>
        <div className="flex gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-green-500">{stats.nailed}</div>
            <div className="text-sm text-zinc-500">Nailed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-500">{stats.meh}</div>
            <div className="text-sm text-zinc-500">Close</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-500">{stats.nope}</div>
            <div className="text-sm text-zinc-500">Nope</div>
          </div>
        </div>
        {unlockedDuring.length > 0 && (
          <div className="px-4 py-3 bg-green-900/30 border border-green-700 rounded-xl text-center">
            <span className="text-green-400 font-semibold">
              Unlocked: {unlockedDuring.map((g) => GROUP_LABELS[g]).join(", ")}
            </span>
          </div>
        )}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => router.push(`/?type=${type}&mode=${mode}`)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-colors"
          >
            Study Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-xl font-semibold transition-colors"
          >
            Home
          </button>
        </div>
      </div>
    );
  }

  const currentCard = queue[currentIndex];

  return (
    <div className="flex-1 flex flex-col items-center justify-between py-8 px-4">
      <div className="w-full flex flex-col items-center gap-4">
        <div className="flex items-center justify-between w-full max-w-sm">
          <button
            onClick={() => router.push("/")}
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
          >
            &larr; Back
          </button>
          <span className="text-sm text-zinc-500 capitalize">
            {type} &middot; {groups.map((g) => (g === "nn" ? "n" : g)).join(", ")}
          </span>
        </div>
        <ProgressBar current={cardsCompleted} total={totalCards * 3} />
      </div>

      <FlashCard card={currentCard.card} result={lastResult} />

      <div className="h-20 flex items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={phase === "input" ? "romaji..." : ""}
            disabled={phase === "result"}
            autoFocus
            className="w-40 px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-xl text-center text-lg focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-colors"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-colors"
          >
            &crarr;
          </button>
        </form>
      </div>
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center text-zinc-500">
          Loading...
        </div>
      }
    >
      <StudySession />
    </Suspense>
  );
}
