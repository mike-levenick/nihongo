"use client";

import { KanaChar, GROUPS, GROUP_LABELS, getKanaSet, KanaType } from "@/data/kana";

interface KanaGridProps {
  type: KanaType;
  selectedGroups: string[];
  onToggleGroup: (group: string) => void;
}

export default function KanaGrid({
  type,
  selectedGroups,
  onToggleGroup,
}: KanaGridProps) {
  const allChars = getKanaSet(type);

  return (
    <div className="w-full max-w-md space-y-3">
      {GROUPS.map((group) => {
        const chars = allChars.filter((c) => c.group === group);
        const selected = selectedGroups.includes(group);
        return (
          <button
            key={group}
            onClick={() => onToggleGroup(group)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
              selected
                ? "border-blue-500 bg-blue-500/10 text-white"
                : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                selected ? "border-blue-500 bg-blue-500" : "border-zinc-600"
              }`}
            >
              {selected && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="font-medium text-sm w-16 text-left">
              {GROUP_LABELS[group]}
            </span>
            <span className="text-xl tracking-wider">
              {chars.map((c) => c.character).join(" ")}
            </span>
          </button>
        );
      })}
    </div>
  );
}
