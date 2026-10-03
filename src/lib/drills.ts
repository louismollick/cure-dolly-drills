export const ROWS = [
  { key: "a", kana: "あ", label: "NO" },
  { key: "i", kana: "い", label: "POLITE" },
  { key: "u", kana: "う", label: "NORMAL" },
  { key: "e", kana: "え", label: "CAN" },
  { key: "o", kana: "お", label: "LET'S" },
] as const;

export type RowKey = (typeof ROWS)[number]["key"];

export type ConjugationTarget =
  | "negative"
  | "polite"
  | "dictionary"
  | "potential"
  | "volitional";

export const TARGETS: Record<
  ConjugationTarget,
  { label: string; row: RowKey; suffix: string }
> = {
  negative: { label: "NO", row: "a", suffix: "ない" },
  polite: { label: "POLITE", row: "i", suffix: "ます" },
  dictionary: { label: "NORMAL", row: "u", suffix: "" },
  potential: { label: "CAN", row: "e", suffix: "る" },
  volitional: { label: "LET'S", row: "o", suffix: "う" },
};

export type GodanEnding = "う" | "く" | "ぐ" | "す" | "つ" | "ぬ" | "ぶ" | "む" | "る";

const ENDING_COLUMNS: Record<GodanEnding, Record<RowKey, string>> = {
  う: { a: "わ", i: "い", u: "う", e: "え", o: "お" },
  く: { a: "か", i: "き", u: "く", e: "け", o: "こ" },
  ぐ: { a: "が", i: "ぎ", u: "ぐ", e: "げ", o: "ご" },
  す: { a: "さ", i: "し", u: "す", e: "せ", o: "そ" },
  つ: { a: "た", i: "ち", u: "つ", e: "て", o: "と" },
  ぬ: { a: "な", i: "に", u: "ぬ", e: "ね", o: "の" },
  ぶ: { a: "ば", i: "び", u: "ぶ", e: "べ", o: "ぼ" },
  む: { a: "ま", i: "み", u: "む", e: "め", o: "も" },
  る: { a: "ら", i: "り", u: "る", e: "れ", o: "ろ" },
};

export type GodanVerb = {
  root: string;
  word: string;
  ending: GodanEnding;
  meaning: string;
};

export const GODAN_VERBS: GodanVerb[] = [
  { root: "買", word: "買う", ending: "う", meaning: "buy" },
  { root: "書", word: "書く", ending: "く", meaning: "write" },
  { root: "行", word: "行く", ending: "く", meaning: "go" },
  { root: "泳", word: "泳ぐ", ending: "ぐ", meaning: "swim" },
  { root: "話", word: "話す", ending: "す", meaning: "speak" },
  { root: "待", word: "待つ", ending: "つ", meaning: "wait" },
  { root: "死", word: "死ぬ", ending: "ぬ", meaning: "die" },
  { root: "遊", word: "遊ぶ", ending: "ぶ", meaning: "play" },
  { root: "読", word: "読む", ending: "む", meaning: "read" },
  { root: "帰", word: "帰る", ending: "る", meaning: "return home" },
  { root: "取", word: "取る", ending: "る", meaning: "take" },
];

export function rowKana(verb: GodanVerb, row: RowKey) {
  return ENDING_COLUMNS[verb.ending][row];
}

export function conjugateGodan(
  verb: GodanVerb,
  target: ConjugationTarget,
) {
  const meta = TARGETS[target];
  return `${verb.root}${rowKana(verb, meta.row)}${meta.suffix}`;
}

export function rowEnding(verb: GodanVerb, row: RowKey) {
  const target = Object.values(TARGETS).find((item) => item.row === row);
  if (!target) {
    return rowKana(verb, row);
  }
  return `${rowKana(verb, row)}${target.suffix}`;
}

export type PairRule = "aru" | "mu" | "bu" | "tsu" | "su";

export const PAIR_RULE_LABELS: Record<PairRule, string> = {
  aru: "A-row + る = SELF",
  mu: "〜む → 〜める · める = OTHER",
  bu: "〜ぶ → 〜べる · べる = OTHER",
  tsu: "〜つ → 〜てる · てる = OTHER",
  su: "〜す = OTHER",
};

export type VerbPair = {
  stem: string;
  self: string;
  selfEnding: string;
  selfGloss: string;
  other: string;
  otherEnding: string;
  otherGloss: string;
  rule: PairRule;
};

export const VERB_PAIRS: VerbPair[] = [
  {
    stem: "閉",
    self: "閉まる",
    selfEnding: "まる",
    selfGloss: "to be shut",
    other: "閉める",
    otherEnding: "める",
    otherGloss: "to shut something",
    rule: "aru",
  },
  {
    stem: "始",
    self: "始まる",
    selfEnding: "まる",
    selfGloss: "to begin",
    other: "始める",
    otherEnding: "める",
    otherGloss: "to begin something",
    rule: "aru",
  },
  {
    stem: "決",
    self: "決まる",
    selfEnding: "まる",
    selfGloss: "to be decided",
    other: "決める",
    otherEnding: "める",
    otherGloss: "to decide something",
    rule: "aru",
  },
  {
    stem: "集",
    self: "集まる",
    selfEnding: "まる",
    selfGloss: "to gather",
    other: "集める",
    otherEnding: "める",
    otherGloss: "to gather things",
    rule: "aru",
  },
  {
    stem: "上",
    self: "上がる",
    selfEnding: "がる",
    selfGloss: "to rise",
    other: "上げる",
    otherEnding: "げる",
    otherGloss: "to raise something",
    rule: "aru",
  },
  {
    stem: "下",
    self: "下がる",
    selfEnding: "がる",
    selfGloss: "to go down",
    other: "下げる",
    otherEnding: "げる",
    otherGloss: "to lower something",
    rule: "aru",
  },
  {
    stem: "沈",
    self: "沈む",
    selfEnding: "む",
    selfGloss: "to sink",
    other: "沈める",
    otherEnding: "める",
    otherGloss: "to sink something",
    rule: "mu",
  },
  {
    stem: "縮",
    self: "縮む",
    selfEnding: "む",
    selfGloss: "to shrink",
    other: "縮める",
    otherEnding: "める",
    otherGloss: "to shorten something",
    rule: "mu",
  },
  {
    stem: "並",
    self: "並ぶ",
    selfEnding: "ぶ",
    selfGloss: "to line up",
    other: "並べる",
    otherEnding: "べる",
    otherGloss: "to arrange things",
    rule: "bu",
  },
  {
    stem: "立",
    self: "立つ",
    selfEnding: "つ",
    selfGloss: "to stand",
    other: "立てる",
    otherEnding: "てる",
    otherGloss: "to stand something up",
    rule: "tsu",
  },
  {
    stem: "育",
    self: "育つ",
    selfEnding: "つ",
    selfGloss: "to grow up",
    other: "育てる",
    otherEnding: "てる",
    otherGloss: "to raise something",
    rule: "tsu",
  },
  {
    stem: "出",
    self: "出る",
    selfEnding: "る",
    selfGloss: "to come out",
    other: "出す",
    otherEnding: "す",
    otherGloss: "to take something out",
    rule: "su",
  },
  {
    stem: "落",
    self: "落ちる",
    selfEnding: "ちる",
    selfGloss: "to fall",
    other: "落とす",
    otherEnding: "とす",
    otherGloss: "to drop something",
    rule: "su",
  },
  {
    stem: "返",
    self: "返る",
    selfEnding: "る",
    selfGloss: "to return",
    other: "返す",
    otherEnding: "す",
    otherGloss: "to return something",
    rule: "su",
  },
  {
    stem: "直",
    self: "直る",
    selfEnding: "る",
    selfGloss: "to be fixed",
    other: "直す",
    otherEnding: "す",
    otherGloss: "to fix something",
    rule: "su",
  },
  {
    stem: "消",
    self: "消える",
    selfEnding: "える",
    selfGloss: "to go out / disappear",
    other: "消す",
    otherEnding: "す",
    otherGloss: "to turn something off / erase it",
    rule: "su",
  },
  {
    stem: "負",
    self: "負ける",
    selfEnding: "ける",
    selfGloss: "to lose",
    other: "負かす",
    otherEnding: "かす",
    otherGloss: "to defeat someone",
    rule: "su",
  },
];

export function shuffle<T>(values: readonly T[]) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}
