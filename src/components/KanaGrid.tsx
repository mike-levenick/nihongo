"use client";

import { GROUPS, GROUP_LABELS, getKanaSet, KanaType } from "@/data/kana";

interface KanaGridProps {
  type: KanaType;
  selectedChars: Set<string>; // set of romaji strings
  onToggleChar: (romaji: string) => void;
  onToggleGroup: (group: string) => void;
}

const CheckIcon = () => (
  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function KanaGrid({
  type,
  selectedChars,
  onToggleChar,
  onToggleGroup,
}: KanaGridProps) {
  const allChars = getKanaSet(type);

  return (
    <div className="w-full max-w-md space-y-3">
      {GROUPS.map((group) => {
        const chars = allChars.filter((c) => c.group === group);
        const allSelected = chars.every((c) => selectedChars.has(c.romaji));
        const someSelected = chars.some((c) => selectedChars.has(c.romaji));
        return (
          <div key={group} className="space-y-1">
            {/* Row header — toggles entire group */}
            <button
              onClick={() => onToggleGroup(group)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl border transition-colors ${
                allSelected
                  ? "border-blue-500 bg-blue-500/10 text-white"
                  : someSelected
                  ? "border-blue-500/50 bg-blue-500/5 text-zinc-300"
                  : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                  allSelected
                    ? "border-blue-500 bg-blue-500"
                    : someSelected
                    ? "border-blue-500/50 bg-blue-500/30"
                    : "border-zinc-600"
                }`}
              >
                {(allSelected || someSelected) && <CheckIcon />}
              </div>
              <span className="font-medium text-sm w-16 text-left">
                {GROUP_LABELS[group]}
              </span>
            </button>
            {/* Individual characters */}
            <div className="flex gap-1.5 pl-8">
              {chars.map((c) => {
                const selected = selectedChars.has(c.romaji);
                return (
                  <button
                    key={c.romaji}
                    onClick={() => onToggleChar(c.romaji)}
                    className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
                      selected
                        ? "border-blue-500 bg-blue-500/10 text-white"
                        : "border-zinc-700 bg-zinc-800/50 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <span className="text-xl leading-tight">{c.character}</span>
                    <span className="text-[10px] leading-tight">
                      {c.aliases ? `${c.romaji}/${c.aliases[0]}` : c.romaji}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
