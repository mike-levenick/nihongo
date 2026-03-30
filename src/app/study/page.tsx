"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { KanaType, KanaChar, getCharsByGroups, getCharsByRomaji, GROUP_LABELS } from "@/data/kana";
import { KATAKANA_WORDS, HIRAGANA_WORDS } from "@/data/words";
import { buildQueue, rateCard, gradeAnswer, gradeWordAnswer, diffAnswer, Rating, CardState } from "@/lib/srs";
import { updateCharAfterRating, revertAndReapply, checkAndUnlock, getCharProgress } from "@/lib/storage";
import FlashCard from "@/components/FlashCard";
import ProgressBar from "@/components/ProgressBar";

type Phase = "input" | "result" | "confirm-remove";

function downgradeRating(r: Rating): Rating {
  if (r === "nailed") return "meh";
  if (r === "meh") return "nope";
  return "nope";
}

function StudySession() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = (searchParams.get("type") as KanaType) || "hiragana";
  const groups = searchParams.get("groups")?.split(",") || null;
  const chars = searchParams.get("chars")?.split(",") || null;
  const mode = searchParams.get("mode") || "study";
  const isEndless = mode === "study" || mode === "weakspots" || mode === "words";
  const isWeakSpots = mode === "weakspots";
  const isWordMode = mode === "words";

  const [queue, setQueue] = useState<CardState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("input");
  const [inputValue, setInputValue] = useState("");
  const [lastResult, setLastResult] = useState<{ rating: Rating; userAnswer: string; diff?: { char: string; correct: boolean }[] } | null>(null);
  const [showHints, setShowHints] = useState(false);
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
  // Queue ready to advance (after rating, before confirm-remove decision)
  const pendingQueueRef = useRef<CardState[]>([]);
  const pendingIndexRef = useRef(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nihongo_wordHints");
      if (saved !== null) setShowHints(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    let selected: KanaChar[];
    if (isWordMode) {
      selected = type === "katakana" ? KATAKANA_WORDS : HIRAGANA_WORDS;
    } else if (chars) {
      selected = getCharsByRomaji(type, chars);
    } else if (groups) {
      selected = getCharsByGroups(type, groups);
    } else {
      selected = [];
    }
    const q = buildQueue(selected);
    setQueue(q);
    setTotalCards(selected.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, groups?.join(","), chars?.join(","), isWordMode]);

  useEffect(() => {
    if (phase === "input") {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [phase, currentIndex]);

  const advanceToNext = useCallback(
    (newQueue: CardState[], idx: number, completed: number) => {
      if (!isEndless && completed >= totalCards * 3) {
        setSessionDone(true);
        return;
      }
      // If queue is empty (all cards removed), end session
      if (newQueue.length === 0) {
        setQueue([]);
        setSessionDone(true);
        return;
      }
      setQueue(newQueue);
      setCurrentIndex(Math.min(idx, newQueue.length - 1));
      setLastResult(null);
      setInputValue("");
      setPhase("input");
    },
    [totalCards, isEndless]
  );

  const scheduleAdvance = useCallback(
    (newQueue: CardState[], idx: number, completed: number) => {
      // In weakspots mode, check if trouble hit 0 after a nailed answer
      if (isWeakSpots) {
        const card = currentCardRef.current;
        if (card) {
          const progress = getCharProgress(type, card.card.romaji);
          if (progress.trouble <= 0) {
            // Store pending state and ask for confirmation
            pendingQueueRef.current = newQueue;
            pendingIndexRef.current = idx;
            setPhase("confirm-remove");
            return;
          }
        }
      }
      timeoutRef.current = setTimeout(() => {
        advanceToNext(newQueue, idx, completed);
      }, 1500);
    },
    [isWeakSpots, type, advanceToNext]
  );

  const handleRemoveCard = useCallback(
    (remove: boolean) => {
      let newQueue = pendingQueueRef.current;
      const idx = pendingIndexRef.current;

      if (remove) {
        // Remove all instances of this card from the queue
        const romaji = currentCardRef.current!.card.romaji;
        newQueue = newQueue.filter((c) => c.card.romaji !== romaji);
      }

      advanceToNext(newQueue, idx, cardsCompleted);
    },
    [advanceToNext, cardsCompleted]
  );

  const handleSubmit = useCallback(() => {
    if (queue.length === 0) return;

    // If in result phase, handle downgrade
    if (phase === "result" && lastResult && lastResult.rating !== "nope") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      const oldRating = lastResult.rating;
      const newRating = downgradeRating(oldRating);
      const card = currentCardRef.current!;

      setStats((s) => ({
        ...s,
        [oldRating]: s[oldRating as keyof typeof s] - 1,
        [newRating]: s[newRating as keyof typeof s] + 1,
      }));

      revertAndReapply(type, card.card.romaji, oldRating, newRating);

      const newQueue = rateCard(preRateQueueRef.current, preRateIndexRef.current, newRating);

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
    const rating = isWordMode
      ? gradeWordAnswer(inputValue, card.card.romaji, card.card.aliases)
      : gradeAnswer(inputValue, card.card.romaji, card.card.aliases);
    const diff = isWordMode && rating !== "nailed"
      ? diffAnswer(inputValue.trim().toLowerCase(), card.card.romaji.toLowerCase())
      : undefined;

    preRateQueueRef.current = queue;
    preRateIndexRef.current = currentIndex;
    currentCardRef.current = card;

    setLastResult({ rating, userAnswer: inputValue, diff });
    setPhase("result");
    setStats((s) => ({ ...s, [rating]: s[rating] + 1 }));
    setCardsCompleted((c) => c + 1);

    updateCharAfterRating(type, card.card.romaji, rating);

    if (mode === "learning") {
      const unlocked = checkAndUnlock(type);
      if (unlocked) {
        setUnlockedDuring((prev) =>
          prev.includes(unlocked) ? prev : [...prev, unlocked]
        );
      }
    }

    const newQueue = rateCard(queue, currentIndex, rating);

    scheduleAdvance(newQueue, currentIndex, cardsCompleted + 1);
  }, [queue, currentIndex, inputValue, type, cardsCompleted, phase, lastResult, mode, advanceToNext, scheduleAdvance]);

  // Listen for Enter during result phase (downgrade) and confirm-remove phase
  useEffect(() => {
    if (phase !== "result" && phase !== "confirm-remove") return;
    const handler = (e: KeyboardEvent) => {
      if (phase === "confirm-remove") {
        if (e.key === "Enter") {
          e.preventDefault();
          handleRemoveCard(true);
        } else if (e.key === " ") {
          e.preventDefault();
          handleRemoveCard(false);
        }
      } else if (phase === "result" && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, handleSubmit, handleRemoveCard]);

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
        <h1 className="text-3xl font-bold">
          {isWeakSpots && queue.length === 0 ? "All Clear!" : "Session Complete"}
        </h1>
        {isWeakSpots && queue.length === 0 && (
          <p className="text-zinc-400">No more weak spots — nice work.</p>
        )}
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
            onClick={() => router.push("/")}
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
  const label = groups
    ? groups.map((g) => (g === "nn" ? "n" : g)).join(", ")
    : `${queue.length} card${queue.length !== 1 ? "s" : ""} left`;

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
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500 capitalize">
              {type} &middot; {label}
            </span>
            {isWordMode && (
              <button
                onClick={() => {
                  const next = !showHints;
                  setShowHints(next);
                  localStorage.setItem("nihongo_wordHints", JSON.stringify(next));
                }}
                className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                  showHints
                    ? "border-blue-500 text-blue-400"
                    : "border-zinc-700 text-zinc-600 hover:text-zinc-400"
                }`}
                title={showHints ? "Hide English hints" : "Show English hints"}
              >
                {showHints ? "hints on" : "hints off"}
              </button>
            )}
          </div>
        </div>
        {isEndless ? (
          <div className="flex gap-4 text-center text-sm">
            <span className="text-green-500">{stats.nailed} nailed</span>
            <span className="text-yellow-500">{stats.meh} close</span>
            <span className="text-red-500">{stats.nope} nope</span>
            <span className="text-zinc-500">{cardsCompleted} total</span>
          </div>
        ) : (
          <ProgressBar current={cardsCompleted} total={totalCards * 3} />
        )}
      </div>

      <FlashCard
        card={currentCard.card}
        result={lastResult}
        troubleScore={isWeakSpots ? getCharProgress(type, currentCard.card.romaji).trouble : null}
        showEnglish={isWordMode && showHints}
      />

      <div className="h-24 flex flex-col items-center justify-center">
        {phase === "confirm-remove" ? (
          <div className="flex flex-col items-center gap-3">
            <span className="text-zinc-300 text-sm font-medium">
              Trouble score hit 0 — remove from stack?
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => handleRemoveCard(true)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-semibold text-white transition-colors"
              >
                Remove
              </button>
              <button
                onClick={() => handleRemoveCard(false)}
                className="px-4 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-sm font-semibold text-zinc-100 transition-colors"
              >
                Keep Practicing
              </button>
            </div>
            <div className="flex gap-3 text-xs text-zinc-600">
              <span className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700">Enter</span>
              <span>remove</span>
              <span className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700">Space</span>
              <span>keep</span>
            </div>
          </div>
        ) : (
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
              className={`${isWordMode ? "w-56" : "w-40"} px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-xl text-center text-lg focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-colors`}
            />
            <button
              type="submit"
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-colors"
            >
              &crarr;
            </button>
          </form>
        )}
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
