"use client";

import { KanaChar } from "@/data/kana";
import { Rating } from "@/lib/srs";

interface ResultInfo {
  rating: Rating;
  userAnswer: string;
}

interface FlashCardProps {
  card: KanaChar;
  result?: ResultInfo | null;
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

export default function FlashCard({ card, result }: FlashCardProps) {
  return (
    <div className="w-72 h-80 select-none">
      <div className="w-full h-full flex flex-col items-center justify-center rounded-2xl bg-zinc-800 border border-zinc-700">
        <span className="text-8xl mb-4">{card.character}</span>
        {result ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl text-zinc-300 font-medium">
              {card.romaji}
            </span>
            <span className={`text-lg font-semibold ${ratingColors[result.rating]}`}>
              {ratingLabels[result.rating]}
            </span>
            {result.rating !== "nailed" && (
              <span className="text-sm text-zinc-500">
                you typed: {result.userAnswer || "(empty)"}
              </span>
            )}
            {result.rating !== "nope" && (
              <span className="text-xs text-zinc-600 mt-2">
                enter = more practice
              </span>
            )}
          </div>
        ) : (
          <span className="text-zinc-600 text-sm">type the romaji</span>
        )}
      </div>
    </div>
  );
}
