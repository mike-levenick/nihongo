"use client";

import { KanaChar } from "@/data/kana";
import { Rating, DiffChar } from "@/lib/srs";

interface ResultInfo {
  rating: Rating;
  userAnswer: string;
  diff?: DiffChar[];
}

interface FlashCardProps {
  card: KanaChar;
  result?: ResultInfo | null;
  troubleScore?: number | null;
  showEnglish?: boolean;
  isWordMode?: boolean;
  canClearCard?: boolean;
}

const ratingColors: Record<Rating, string> = {
  nailed: "text-green-400",
  meh: "text-yellow-400",
  nope: "text-red-400",
};

const ratingLabels: Record<Rating, string> = {
  nailed: "Correct!",
  meh: "Close",
  nope: "Nope",
};

function charSizeClass(text: string): string {
  const len = text.length;
  if (len <= 2) return "text-8xl";
  if (len <= 4) return "text-6xl";
  if (len <= 6) return "text-5xl";
  return "text-4xl";
}

export default function FlashCard({ card, result, troubleScore, showEnglish, isWordMode, canClearCard }: FlashCardProps) {
  return (
    <div className={`w-full ${card.character.length > 4 ? "max-w-md" : "max-w-sm"} min-h-80 select-none relative`}>
      <div className="w-full min-h-80 flex flex-col items-center justify-center rounded-2xl bg-zinc-800 border border-zinc-700 px-4 py-6">
        {troubleScore != null && troubleScore > 0 && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 text-xs font-medium">
            {troubleScore}
          </div>
        )}
        <span className={`${charSizeClass(card.character)} mb-2 text-center leading-tight`}>
          {card.character}
        </span>
        {showEnglish && card.english && !result && (
          <span className="text-sm text-zinc-500 mb-2">{card.english}</span>
        )}
        {result ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl text-zinc-300 font-medium">
              {card.romaji}
              {card.aliases && (
                <span className="text-base text-zinc-500"> ({card.aliases.join("/")})</span>
              )}
            </span>
            {card.english && (
              <span className="text-sm text-zinc-500">{card.english}</span>
            )}
            <span className={`text-lg font-semibold ${ratingColors[result.rating]}`}>
              {ratingLabels[result.rating]}
            </span>
            {result.rating !== "nailed" && result.diff && (
              <span className="text-sm font-mono">
                {result.diff.map((d, i) => (
                  <span key={i} className={d.correct ? "text-green-400" : "text-red-400"}>
                    {d.char}
                  </span>
                ))}
              </span>
            )}
            {result.rating !== "nailed" && !result.diff && (
              <span className="text-sm text-zinc-500">
                you typed: {result.userAnswer || "(empty)"}
              </span>
            )}
            {result.rating === "nailed" ? (
              <div className="flex flex-col items-center gap-0.5 mt-1">
                <span className="text-xs text-zinc-600">
                  {isWordMode ? "enter = next" : "backspace = more practice"}
                </span>
                {canClearCard && (
                  <span className="text-xs text-green-600">
                    <span className="px-1.5 py-0.5 bg-zinc-700 rounded border border-zinc-600 mr-1">esc</span>
                    clear this card
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-0.5 mt-1">
                <span className="text-xs text-zinc-500">
                  <span className="px-1.5 py-0.5 bg-zinc-700 rounded border border-zinc-600 mr-1">enter</span>
                  next
                  {result.rating !== "nope" && (
                    <>
                      <span className="mx-2 text-zinc-700">|</span>
                      <span className="px-1.5 py-0.5 bg-zinc-700 rounded border border-zinc-600 mr-1">backspace</span>
                      more practice
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-zinc-600 text-sm">type the romaji</span>
        )}
      </div>
    </div>
  );
}
