export type KanaType = "hiragana" | "katakana";

export interface KanaChar {
  character: string;
  romaji: string;
  group: string;
}

export const GROUPS = [
  "vowel",
  "k",
  "s",
  "t",
  "n",
  "h",
  "m",
  "y",
  "r",
  "w",
  "nn",
] as const;

export const GROUP_LABELS: Record<string, string> = {
  vowel: "Vowels",
  k: "K-row",
  s: "S-row",
  t: "T-row",
  n: "N-row",
  h: "H-row",
  m: "M-row",
  y: "Y-row",
  r: "R-row",
  w: "W-row",
  nn: "N",
};

export const HIRAGANA: KanaChar[] = [
  // Vowels
  { character: "あ", romaji: "a", group: "vowel" },
  { character: "い", romaji: "i", group: "vowel" },
  { character: "う", romaji: "u", group: "vowel" },
  { character: "え", romaji: "e", group: "vowel" },
  { character: "お", romaji: "o", group: "vowel" },
  // K-row
  { character: "か", romaji: "ka", group: "k" },
  { character: "き", romaji: "ki", group: "k" },
  { character: "く", romaji: "ku", group: "k" },
  { character: "け", romaji: "ke", group: "k" },
  { character: "こ", romaji: "ko", group: "k" },
  // S-row
  { character: "さ", romaji: "sa", group: "s" },
  { character: "し", romaji: "shi", group: "s" },
  { character: "す", romaji: "su", group: "s" },
  { character: "せ", romaji: "se", group: "s" },
  { character: "そ", romaji: "so", group: "s" },
  // T-row
  { character: "た", romaji: "ta", group: "t" },
  { character: "ち", romaji: "chi", group: "t" },
  { character: "つ", romaji: "tsu", group: "t" },
  { character: "て", romaji: "te", group: "t" },
  { character: "と", romaji: "to", group: "t" },
  // N-row
  { character: "な", romaji: "na", group: "n" },
  { character: "に", romaji: "ni", group: "n" },
  { character: "ぬ", romaji: "nu", group: "n" },
  { character: "ね", romaji: "ne", group: "n" },
  { character: "の", romaji: "no", group: "n" },
  // H-row
  { character: "は", romaji: "ha", group: "h" },
  { character: "ひ", romaji: "hi", group: "h" },
  { character: "ふ", romaji: "fu", group: "h" },
  { character: "へ", romaji: "he", group: "h" },
  { character: "ほ", romaji: "ho", group: "h" },
  // M-row
  { character: "ま", romaji: "ma", group: "m" },
  { character: "み", romaji: "mi", group: "m" },
  { character: "む", romaji: "mu", group: "m" },
  { character: "め", romaji: "me", group: "m" },
  { character: "も", romaji: "mo", group: "m" },
  // Y-row
  { character: "や", romaji: "ya", group: "y" },
  { character: "ゆ", romaji: "yu", group: "y" },
  { character: "よ", romaji: "yo", group: "y" },
  // R-row
  { character: "ら", romaji: "ra", group: "r" },
  { character: "り", romaji: "ri", group: "r" },
  { character: "る", romaji: "ru", group: "r" },
  { character: "れ", romaji: "re", group: "r" },
  { character: "ろ", romaji: "ro", group: "r" },
  // W-row
  { character: "わ", romaji: "wa", group: "w" },
  { character: "を", romaji: "wo", group: "w" },
  // N
  { character: "ん", romaji: "n", group: "nn" },
];

export const KATAKANA: KanaChar[] = [
  // Vowels
  { character: "ア", romaji: "a", group: "vowel" },
  { character: "イ", romaji: "i", group: "vowel" },
  { character: "ウ", romaji: "u", group: "vowel" },
  { character: "エ", romaji: "e", group: "vowel" },
  { character: "オ", romaji: "o", group: "vowel" },
  // K-row
  { character: "カ", romaji: "ka", group: "k" },
  { character: "キ", romaji: "ki", group: "k" },
  { character: "ク", romaji: "ku", group: "k" },
  { character: "ケ", romaji: "ke", group: "k" },
  { character: "コ", romaji: "ko", group: "k" },
  // S-row
  { character: "サ", romaji: "sa", group: "s" },
  { character: "シ", romaji: "shi", group: "s" },
  { character: "ス", romaji: "su", group: "s" },
  { character: "セ", romaji: "se", group: "s" },
  { character: "ソ", romaji: "so", group: "s" },
  // T-row
  { character: "タ", romaji: "ta", group: "t" },
  { character: "チ", romaji: "chi", group: "t" },
  { character: "ツ", romaji: "tsu", group: "t" },
  { character: "テ", romaji: "te", group: "t" },
  { character: "ト", romaji: "to", group: "t" },
  // N-row
  { character: "ナ", romaji: "na", group: "n" },
  { character: "ニ", romaji: "ni", group: "n" },
  { character: "ヌ", romaji: "nu", group: "n" },
  { character: "ネ", romaji: "ne", group: "n" },
  { character: "ノ", romaji: "no", group: "n" },
  // H-row
  { character: "ハ", romaji: "ha", group: "h" },
  { character: "ヒ", romaji: "hi", group: "h" },
  { character: "フ", romaji: "fu", group: "h" },
  { character: "ヘ", romaji: "he", group: "h" },
  { character: "ホ", romaji: "ho", group: "h" },
  // M-row
  { character: "マ", romaji: "ma", group: "m" },
  { character: "ミ", romaji: "mi", group: "m" },
  { character: "ム", romaji: "mu", group: "m" },
  { character: "メ", romaji: "me", group: "m" },
  { character: "モ", romaji: "mo", group: "m" },
  // Y-row
  { character: "ヤ", romaji: "ya", group: "y" },
  { character: "ユ", romaji: "yu", group: "y" },
  { character: "ヨ", romaji: "yo", group: "y" },
  // R-row
  { character: "ラ", romaji: "ra", group: "r" },
  { character: "リ", romaji: "ri", group: "r" },
  { character: "ル", romaji: "ru", group: "r" },
  { character: "レ", romaji: "re", group: "r" },
  { character: "ロ", romaji: "ro", group: "r" },
  // W-row
  { character: "ワ", romaji: "wa", group: "w" },
  { character: "ヲ", romaji: "wo", group: "w" },
  // N
  { character: "ン", romaji: "n", group: "nn" },
];

export function getKanaSet(type: KanaType): KanaChar[] {
  return type === "hiragana" ? HIRAGANA : KATAKANA;
}

export function getCharsByGroups(
  type: KanaType,
  groups: string[]
): KanaChar[] {
  return getKanaSet(type).filter((k) => groups.includes(k.group));
}

export function getCharsByRomaji(
  type: KanaType,
  romajis: string[]
): KanaChar[] {
  const set = new Set(romajis);
  return getKanaSet(type).filter((k) => set.has(k.romaji));
}
