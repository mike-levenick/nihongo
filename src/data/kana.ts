export type KanaType = "hiragana" | "katakana";

export interface KanaChar {
  character: string;
  romaji: string;
  group: string;
  aliases?: string[];
  english?: string;
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
  "g",
  "z",
  "d",
  "b",
  "p",
  "ky",
  "sh",
  "ch",
  "ny",
  "hy",
  "my",
  "ry",
  "gy",
  "j",
  "by",
  "py",
  "sokuon",
  "long",
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
  g: "G-row",
  z: "Z-row",
  d: "D-row",
  b: "B-row",
  p: "P-row",
  ky: "Ky-combo",
  sh: "Sh-combo",
  ch: "Ch-combo",
  ny: "Ny-combo",
  hy: "Hy-combo",
  my: "My-combo",
  ry: "Ry-combo",
  gy: "Gy-combo",
  j: "J-combo",
  by: "By-combo",
  py: "Py-combo",
  sokuon: "Small っ",
  long: "Long vowels",
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
  // G-row (dakuten of K)
  { character: "が", romaji: "ga", group: "g" },
  { character: "ぎ", romaji: "gi", group: "g" },
  { character: "ぐ", romaji: "gu", group: "g" },
  { character: "げ", romaji: "ge", group: "g" },
  { character: "ご", romaji: "go", group: "g" },
  // Z-row (dakuten of S)
  { character: "ざ", romaji: "za", group: "z" },
  { character: "じ", romaji: "ji", group: "z" },
  { character: "ず", romaji: "zu", group: "z" },
  { character: "ぜ", romaji: "ze", group: "z" },
  { character: "ぞ", romaji: "zo", group: "z" },
  // D-row (dakuten of T)
  { character: "だ", romaji: "da", group: "d" },
  { character: "ぢ", romaji: "di", group: "d", aliases: ["ji"] },
  { character: "づ", romaji: "du", group: "d", aliases: ["zu"] },
  { character: "で", romaji: "de", group: "d" },
  { character: "ど", romaji: "do", group: "d" },
  // B-row (dakuten of H)
  { character: "ば", romaji: "ba", group: "b" },
  { character: "び", romaji: "bi", group: "b" },
  { character: "ぶ", romaji: "bu", group: "b" },
  { character: "べ", romaji: "be", group: "b" },
  { character: "ぼ", romaji: "bo", group: "b" },
  // P-row (handakuten of H)
  { character: "ぱ", romaji: "pa", group: "p" },
  { character: "ぴ", romaji: "pi", group: "p" },
  { character: "ぷ", romaji: "pu", group: "p" },
  { character: "ぺ", romaji: "pe", group: "p" },
  { character: "ぽ", romaji: "po", group: "p" },
  // Yōon (combo characters)
  { character: "きゃ", romaji: "kya", group: "ky" },
  { character: "きゅ", romaji: "kyu", group: "ky" },
  { character: "きょ", romaji: "kyo", group: "ky" },
  { character: "しゃ", romaji: "sha", group: "sh" },
  { character: "しゅ", romaji: "shu", group: "sh" },
  { character: "しょ", romaji: "sho", group: "sh" },
  { character: "ちゃ", romaji: "cha", group: "ch" },
  { character: "ちゅ", romaji: "chu", group: "ch" },
  { character: "ちょ", romaji: "cho", group: "ch" },
  { character: "にゃ", romaji: "nya", group: "ny" },
  { character: "にゅ", romaji: "nyu", group: "ny" },
  { character: "にょ", romaji: "nyo", group: "ny" },
  { character: "ひゃ", romaji: "hya", group: "hy" },
  { character: "ひゅ", romaji: "hyu", group: "hy" },
  { character: "ひょ", romaji: "hyo", group: "hy" },
  { character: "みゃ", romaji: "mya", group: "my" },
  { character: "みゅ", romaji: "myu", group: "my" },
  { character: "みょ", romaji: "myo", group: "my" },
  { character: "りゃ", romaji: "rya", group: "ry" },
  { character: "りゅ", romaji: "ryu", group: "ry" },
  { character: "りょ", romaji: "ryo", group: "ry" },
  // Yōon with dakuten
  { character: "ぎゃ", romaji: "gya", group: "gy" },
  { character: "ぎゅ", romaji: "gyu", group: "gy" },
  { character: "ぎょ", romaji: "gyo", group: "gy" },
  { character: "じゃ", romaji: "ja", group: "j" },
  { character: "じゅ", romaji: "ju", group: "j" },
  { character: "じょ", romaji: "jo", group: "j" },
  { character: "びゃ", romaji: "bya", group: "by" },
  { character: "びゅ", romaji: "byu", group: "by" },
  { character: "びょ", romaji: "byo", group: "by" },
  { character: "ぴゃ", romaji: "pya", group: "py" },
  { character: "ぴゅ", romaji: "pyu", group: "py" },
  { character: "ぴょ", romaji: "pyo", group: "py" },
  // Small っ (sokuon) — doubles the following consonant
  { character: "っ+k", romaji: "kk", group: "sokuon" },
  { character: "っ+s", romaji: "ss", group: "sokuon" },
  { character: "っ+t", romaji: "tt", group: "sokuon" },
  { character: "っ+p", romaji: "pp", group: "sokuon" },
  // Long vowels
  { character: "ああ", romaji: "aa", group: "long" },
  { character: "いい", romaji: "ii", group: "long" },
  { character: "うう", romaji: "uu", group: "long" },
  { character: "ええ", romaji: "ee", group: "long" },
  { character: "おお", romaji: "oo", group: "long" },
  { character: "えい", romaji: "ei", group: "long" },
  { character: "おう", romaji: "ou", group: "long" },
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
  // G-row (dakuten of K)
  { character: "ガ", romaji: "ga", group: "g" },
  { character: "ギ", romaji: "gi", group: "g" },
  { character: "グ", romaji: "gu", group: "g" },
  { character: "ゲ", romaji: "ge", group: "g" },
  { character: "ゴ", romaji: "go", group: "g" },
  // Z-row (dakuten of S)
  { character: "ザ", romaji: "za", group: "z" },
  { character: "ジ", romaji: "ji", group: "z" },
  { character: "ズ", romaji: "zu", group: "z" },
  { character: "ゼ", romaji: "ze", group: "z" },
  { character: "ゾ", romaji: "zo", group: "z" },
  // D-row (dakuten of T)
  { character: "ダ", romaji: "da", group: "d" },
  { character: "ヂ", romaji: "di", group: "d", aliases: ["ji"] },
  { character: "ヅ", romaji: "du", group: "d", aliases: ["zu"] },
  { character: "デ", romaji: "de", group: "d" },
  { character: "ド", romaji: "do", group: "d" },
  // B-row (dakuten of H)
  { character: "バ", romaji: "ba", group: "b" },
  { character: "ビ", romaji: "bi", group: "b" },
  { character: "ブ", romaji: "bu", group: "b" },
  { character: "ベ", romaji: "be", group: "b" },
  { character: "ボ", romaji: "bo", group: "b" },
  // P-row (handakuten of H)
  { character: "パ", romaji: "pa", group: "p" },
  { character: "ピ", romaji: "pi", group: "p" },
  { character: "プ", romaji: "pu", group: "p" },
  { character: "ペ", romaji: "pe", group: "p" },
  { character: "ポ", romaji: "po", group: "p" },
  // Yōon (combo characters)
  { character: "キャ", romaji: "kya", group: "ky" },
  { character: "キュ", romaji: "kyu", group: "ky" },
  { character: "キョ", romaji: "kyo", group: "ky" },
  { character: "シャ", romaji: "sha", group: "sh" },
  { character: "シュ", romaji: "shu", group: "sh" },
  { character: "ショ", romaji: "sho", group: "sh" },
  { character: "チャ", romaji: "cha", group: "ch" },
  { character: "チュ", romaji: "chu", group: "ch" },
  { character: "チョ", romaji: "cho", group: "ch" },
  { character: "ニャ", romaji: "nya", group: "ny" },
  { character: "ニュ", romaji: "nyu", group: "ny" },
  { character: "ニョ", romaji: "nyo", group: "ny" },
  { character: "ヒャ", romaji: "hya", group: "hy" },
  { character: "ヒュ", romaji: "hyu", group: "hy" },
  { character: "ヒョ", romaji: "hyo", group: "hy" },
  { character: "ミャ", romaji: "mya", group: "my" },
  { character: "ミュ", romaji: "myu", group: "my" },
  { character: "ミョ", romaji: "myo", group: "my" },
  { character: "リャ", romaji: "rya", group: "ry" },
  { character: "リュ", romaji: "ryu", group: "ry" },
  { character: "リョ", romaji: "ryo", group: "ry" },
  // Yōon with dakuten
  { character: "ギャ", romaji: "gya", group: "gy" },
  { character: "ギュ", romaji: "gyu", group: "gy" },
  { character: "ギョ", romaji: "gyo", group: "gy" },
  { character: "ジャ", romaji: "ja", group: "j" },
  { character: "ジュ", romaji: "ju", group: "j" },
  { character: "ジョ", romaji: "jo", group: "j" },
  { character: "ビャ", romaji: "bya", group: "by" },
  { character: "ビュ", romaji: "byu", group: "by" },
  { character: "ビョ", romaji: "byo", group: "by" },
  { character: "ピャ", romaji: "pya", group: "py" },
  { character: "ピュ", romaji: "pyu", group: "py" },
  { character: "ピョ", romaji: "pyo", group: "py" },
  // Small ッ (sokuon) — doubles the following consonant
  { character: "ッ+k", romaji: "kk", group: "sokuon" },
  { character: "ッ+s", romaji: "ss", group: "sokuon" },
  { character: "ッ+t", romaji: "tt", group: "sokuon" },
  { character: "ッ+p", romaji: "pp", group: "sokuon" },
  // Long vowels (katakana uses ー)
  { character: "アー", romaji: "aa", group: "long" },
  { character: "イー", romaji: "ii", group: "long" },
  { character: "ウー", romaji: "uu", group: "long" },
  { character: "エー", romaji: "ee", group: "long" },
  { character: "オー", romaji: "oo", group: "long" },
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
