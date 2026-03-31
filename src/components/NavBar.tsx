"use client";

import { useRouter } from "next/navigation";
import { saveLastNav } from "@/lib/storage";

interface NavBarProps {
  onBack?: () => void;
  onHome?: () => void;
}

export default function NavBar({ onBack, onHome }: NavBarProps) {
  const router = useRouter();

  return (
    <nav aria-label="Navigation" className="w-full max-w-md flex justify-between pt-4">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
        >
          <span aria-hidden="true">&larr;</span> Back
        </button>
      ) : (
        <div />
      )}
      <button
        type="button"
        aria-label="Home"
        onClick={() => {
          saveLastNav(null, null);
          if (onHome) {
            onHome();
          } else {
            router.push("/");
          }
        }}
        className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
      >
        Home
      </button>
    </nav>
  );
}
