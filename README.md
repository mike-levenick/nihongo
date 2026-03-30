# 日本, Go!

A Japanese flashcard study app for drilling hiragana and katakana. Built because Duolingo doesn't let you focus on the specific characters you're struggling with.

Type the romaji for each character, and the app auto-grades you. Characters you miss come back sooner; characters you nail go to the bottom of the stack.

## Modes

**Learning Mode** — Progressive unlock. Start with vowels (a, i, u, e, o) and unlock each row (K, S, T, ...) as you master the previous one. Mastery is score-based: nailing characters increases their score, missing them decreases it. Once every character in a row hits the threshold, the next row unlocks automatically.

**Study Mode** — Endless flashcard stack. Pick exactly which rows or individual characters you want to drill. Want to just hammer ra, ri, ru, re, ro? Select those and go. The session runs forever until you quit — no fixed end point.

**Weak Spots** — Auto-selects characters you struggle with most. Every miss increases a character's "trouble" score; every correct answer decreases it. This mode pulls in everything with a trouble score above zero, sorted by most troublesome first. When a character's trouble hits zero, you're prompted to remove it from the stack or keep practicing.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Works on desktop, iPad, and phone (just open it in Safari). No internet required after the initial load — study on the plane.

## Tech

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- All progress stored in localStorage — no backend, no accounts
- Deployable to Vercel with zero config
