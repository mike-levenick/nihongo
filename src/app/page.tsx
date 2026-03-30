"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KanaType, GROUPS, GROUP_LABELS, getKanaSet } from "@/data/kana";
import { getUnlockedGroups, getGroupScore } from "@/lib/storage";
import KanaGrid from "@/components/KanaGrid";

type Mode = "learning" | "study";

function HomeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL params (used by "Study Again" from session complete)
  const initType = searchParams.get("type") as KanaType | null;
  const initMode = searchParams.get("mode") as Mode | null;

  const [kanaType, setKanaType] = useState<KanaType | null>(initType);
  const [mode, setMode] = useState<Mode | null>(initMode);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const handleToggleGroup = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group)
        ? prev.filter((g) => g !== group)
        : [...prev, group]
    );
  };

  const startStudy = (groups: string[], studyMode: string) => {
    if (groups.length === 0 || !kanaType) return;
    const params = new URLSearchParams({
      type: kanaType,
      groups: groups.join(","),
      mode: studyMode,
    });
    router.push(`/study?${params.toString()}`);
  };

  // Step 1: Pick kana type
  if (!kanaType) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2"><span className="text-5xl">日本</span>, Go!</h1>
          <p className="text-zinc-500">What do you want to study?</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setKanaType("hiragana")}
            className="flex flex-col items-center gap-2 px-8 py-6 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-2xl transition-colors"
          >
            <span className="text-4xl">あ</span>
            <span className="font-medium">Hiragana</span>
          </button>
          <button
            onClick={() => setKanaType("katakana")}
            className="flex flex-col items-center gap-2 px-8 py-6 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-2xl transition-colors"
          >
            <span className="text-4xl">ア</span>
            <span className="font-medium">Katakana</span>
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Pick mode
  if (!mode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4">
        <button
          onClick={() => {
            setKanaType(null);
            setMode(null);
          }}
          className="absolute top-4 left-4 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
        >
          &larr; Back
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 capitalize">{kanaType}</h1>
          <p className="text-zinc-500">Choose your mode</p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => setMode("learning")}
            className="flex flex-col items-start gap-1 px-6 py-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-2xl transition-colors text-left"
          >
            <span className="font-semibold text-lg">Learning Mode</span>
            <span className="text-sm text-zinc-400">
              Progressive unlock — master each row to unlock the next
            </span>
          </button>
          <button
            onClick={() => {
              setMode("study");
              setSelectedGroups([]);
            }}
            className="flex flex-col items-start gap-1 px-6 py-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-2xl transition-colors text-left"
          >
            <span className="font-semibold text-lg">Study Mode</span>
            <span className="text-sm text-zinc-400">
              Pick exactly which rows to drill
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Learning mode: show unlocked groups with selectable rows
  if (mode === "learning") {
    const unlocked = getUnlockedGroups(kanaType);
    const allChars = getKanaSet(kanaType);

    // Initialize selectedGroups to all unlocked if empty
    const learningSelected =
      selectedGroups.length > 0
        ? selectedGroups.filter((g) => unlocked.includes(g))
        : unlocked;

    const toggleLearningGroup = (group: string) => {
      const current =
        selectedGroups.length > 0
          ? selectedGroups.filter((g) => unlocked.includes(g))
          : [...unlocked];
      if (current.includes(group)) {
        // Don't allow deselecting all
        if (current.length <= 1) return;
        setSelectedGroups(current.filter((g) => g !== group));
      } else {
        setSelectedGroups([...current, group]);
      }
    };

    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        <button
          onClick={() => {
            setMode(null);
            setSelectedGroups([]);
          }}
          className="absolute top-4 left-4 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
        >
          &larr; Back
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Learning Mode</h1>
          <p className="text-zinc-500 capitalize">{kanaType}</p>
        </div>

        <div className="w-full max-w-md space-y-2">
          {GROUPS.map((group) => {
            const isUnlocked = unlocked.includes(group);
            const chars = allChars.filter((c) => c.group === group);
            const score = isUnlocked
              ? getGroupScore(kanaType, group)
              : null;
            const isSelected = learningSelected.includes(group);

            if (!isUnlocked) {
              return (
                <div
                  key={group}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-600"
                >
                  <span className="font-medium text-sm w-16">
                    {GROUP_LABELS[group]}
                  </span>
                  <span className="text-xl tracking-wider flex-1 blur-sm">
                    {chars.map((c) => c.character).join(" ")}
                  </span>
                  <span className="text-xs text-zinc-600">locked</span>
                </div>
              );
            }

            return (
              <button
                key={group}
                onClick={() => toggleLearningGroup(group)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? "border-blue-500 bg-blue-500" : "border-zinc-600"
                  }`}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="font-medium text-sm w-16 text-left">
                  {GROUP_LABELS[group]}
                </span>
                <span className="text-xl tracking-wider flex-1">
                  {chars.map((c) => c.character).join(" ")}
                </span>
                {score && (
                  <span
                    className={`text-xs font-medium ${
                      score.mastered === score.total
                        ? "text-green-400"
                        : "text-zinc-500"
                    }`}
                  >
                    {score.mastered}/{score.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => startStudy(learningSelected, "learning")}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-lg transition-colors"
          >
            Start Studying
          </button>
          <p className="text-xs text-zinc-600">
            {learningSelected.length} of {unlocked.length} row{unlocked.length !== 1 ? "s" : ""} selected
          </p>
        </div>
      </div>
    );
  }

  // Study mode: pick groups
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-8">
      <button
        onClick={() => setMode(null)}
        className="absolute top-4 left-4 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
      >
        &larr; Back
      </button>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Study Mode</h1>
        <p className="text-zinc-500 capitalize">
          {kanaType} — pick rows to study
        </p>
      </div>

      <KanaGrid
        type={kanaType}
        selectedGroups={selectedGroups}
        onToggleGroup={handleToggleGroup}
      />

      <button
        onClick={() => startStudy(selectedGroups, "study")}
        disabled={selectedGroups.length === 0}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-xl font-semibold text-lg transition-colors"
      >
        Start ({selectedGroups.length} row{selectedGroups.length !== 1 ? "s" : ""})
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
  );
}
