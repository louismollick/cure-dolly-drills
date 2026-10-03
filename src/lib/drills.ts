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
  | "potential"
  | "volitional";

export const TARGETS: Record<
  ConjugationTarget,
  { label: string; row: RowKey; suffix: string }
> = {
  negative: { label: "NO", row: "a", suffix: "ない" },
  polite: { label: "POLITE", row: "i", suffix: "ます" },
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
  readingRoot: string;
  ending: GodanEnding;
  meaning: string;
};

export type NonGodanKind = "ichidan" | "suru" | "kuru";

export type NonGodanVerb = {
  kind: NonGodanKind;
  root: string;
  word: string;
  readingRoot: string;
  meaning: string;
};

export type ConjugationVerb = GodanVerb | NonGodanVerb;

export const GODAN_VERBS: GodanVerb[] = [
  { root: "買", word: "買う", readingRoot: "か", ending: "う", meaning: "buy" },
  { root: "会", word: "会う", readingRoot: "あ", ending: "う", meaning: "meet" },
  { root: "合", word: "合う", readingRoot: "あ", ending: "う", meaning: "fit / match" },
  { root: "洗", word: "洗う", readingRoot: "あら", ending: "う", meaning: "wash" },
  { root: "払", word: "払う", readingRoot: "はら", ending: "う", meaning: "pay" },
  { root: "拾", word: "拾う", readingRoot: "ひろ", ending: "う", meaning: "pick up" },
  { root: "笑", word: "笑う", readingRoot: "わら", ending: "う", meaning: "laugh" },
  { root: "歌", word: "歌う", readingRoot: "うた", ending: "う", meaning: "sing" },
  { root: "使", word: "使う", readingRoot: "つか", ending: "う", meaning: "use" },
  { root: "習", word: "習う", readingRoot: "なら", ending: "う", meaning: "learn" },
  { root: "迷", word: "迷う", readingRoot: "まよ", ending: "う", meaning: "get lost / hesitate" },
  { root: "誘", word: "誘う", readingRoot: "さそ", ending: "う", meaning: "invite" },
  { root: "扱", word: "扱う", readingRoot: "あつか", ending: "う", meaning: "handle" },
  { root: "祝", word: "祝う", readingRoot: "いわ", ending: "う", meaning: "celebrate" },
  { root: "失", word: "失う", readingRoot: "うしな", ending: "う", meaning: "lose" },
  { root: "救", word: "救う", readingRoot: "すく", ending: "う", meaning: "save / rescue" },
  { root: "追", word: "追う", readingRoot: "お", ending: "う", meaning: "chase" },
  { root: "願", word: "願う", readingRoot: "ねが", ending: "う", meaning: "wish" },
  { root: "思", word: "思う", readingRoot: "おも", ending: "う", meaning: "think" },
  { root: "違", word: "違う", readingRoot: "ちが", ending: "う", meaning: "differ / be wrong" },
  { root: "向か", word: "向かう", readingRoot: "むか", ending: "う", meaning: "head toward" },
  { root: "似合", word: "似合う", readingRoot: "にあ", ending: "う", meaning: "suit / look good on" },
  { root: "行", word: "行う", readingRoot: "おこな", ending: "う", meaning: "carry out" },
  { root: "伺", word: "伺う", readingRoot: "うかが", ending: "う", meaning: "ask / visit humbly" },
  { root: "書", word: "書く", readingRoot: "か", ending: "く", meaning: "write" },
  { root: "行", word: "行く", readingRoot: "い", ending: "く", meaning: "go" },
  { root: "聞", word: "聞く", readingRoot: "き", ending: "く", meaning: "listen / ask" },
  { root: "歩", word: "歩く", readingRoot: "ある", ending: "く", meaning: "walk" },
  { root: "働", word: "働く", readingRoot: "はたら", ending: "く", meaning: "work" },
  { root: "開", word: "開く", readingRoot: "ひら", ending: "く", meaning: "open" },
  { root: "届", word: "届く", readingRoot: "とど", ending: "く", meaning: "reach / arrive" },
  { root: "続", word: "続く", readingRoot: "つづ", ending: "く", meaning: "continue" },
  { root: "動", word: "動く", readingRoot: "うご", ending: "く", meaning: "move" },
  { root: "泣", word: "泣く", readingRoot: "な", ending: "く", meaning: "cry" },
  { root: "磨", word: "磨く", readingRoot: "みが", ending: "く", meaning: "polish / brush" },
  { root: "叩", word: "叩く", readingRoot: "たた", ending: "く", meaning: "hit / tap" },
  { root: "描", word: "描く", readingRoot: "えが", ending: "く", meaning: "draw" },
  { root: "焼", word: "焼く", readingRoot: "や", ending: "く", meaning: "grill / bake" },
  { root: "咲", word: "咲く", readingRoot: "さ", ending: "く", meaning: "bloom" },
  { root: "置", word: "置く", readingRoot: "お", ending: "く", meaning: "put / place" },
  { root: "解", word: "解く", readingRoot: "と", ending: "く", meaning: "solve / untie" },
  { root: "向", word: "向く", readingRoot: "む", ending: "く", meaning: "face / turn toward" },
  { root: "招", word: "招く", readingRoot: "まね", ending: "く", meaning: "invite / cause" },
  { root: "驚", word: "驚く", readingRoot: "おどろ", ending: "く", meaning: "be surprised" },
  { root: "輝", word: "輝く", readingRoot: "かがや", ending: "く", meaning: "shine" },
  { root: "乾", word: "乾く", readingRoot: "かわ", ending: "く", meaning: "dry" },
  { root: "省", word: "省く", readingRoot: "はぶ", ending: "く", meaning: "omit" },
  { root: "吐", word: "吐く", readingRoot: "は", ending: "く", meaning: "spit / exhale" },
  { root: "抱", word: "抱く", readingRoot: "だ", ending: "く", meaning: "embrace / hold" },
  { root: "泳", word: "泳ぐ", readingRoot: "およ", ending: "ぐ", meaning: "swim" },
  { root: "急", word: "急ぐ", readingRoot: "いそ", ending: "ぐ", meaning: "hurry" },
  { root: "騒", word: "騒ぐ", readingRoot: "さわ", ending: "ぐ", meaning: "make noise" },
  { root: "稼", word: "稼ぐ", readingRoot: "かせ", ending: "ぐ", meaning: "earn" },
  { root: "注", word: "注ぐ", readingRoot: "そそ", ending: "ぐ", meaning: "pour" },
  { root: "脱", word: "脱ぐ", readingRoot: "ぬ", ending: "ぐ", meaning: "take off" },
  { root: "防", word: "防ぐ", readingRoot: "ふせ", ending: "ぐ", meaning: "prevent" },
  { root: "嗅", word: "嗅ぐ", readingRoot: "か", ending: "ぐ", meaning: "smell / sniff" },
  { root: "研", word: "研ぐ", readingRoot: "と", ending: "ぐ", meaning: "sharpen" },
  { root: "漕", word: "漕ぐ", readingRoot: "こ", ending: "ぐ", meaning: "row / pedal" },
  { root: "担", word: "担ぐ", readingRoot: "かつ", ending: "ぐ", meaning: "carry on shoulder" },
  { root: "継", word: "継ぐ", readingRoot: "つ", ending: "ぐ", meaning: "inherit / succeed" },
  { root: "話", word: "話す", readingRoot: "はな", ending: "す", meaning: "speak" },
  { root: "貸", word: "貸す", readingRoot: "か", ending: "す", meaning: "lend" },
  { root: "返", word: "返す", readingRoot: "かえ", ending: "す", meaning: "return something" },
  { root: "消", word: "消す", readingRoot: "け", ending: "す", meaning: "turn off / erase" },
  { root: "直", word: "直す", readingRoot: "なお", ending: "す", meaning: "fix" },
  { root: "探", word: "探す", readingRoot: "さが", ending: "す", meaning: "search for" },
  { root: "押", word: "押す", readingRoot: "お", ending: "す", meaning: "push" },
  { root: "渡", word: "渡す", readingRoot: "わた", ending: "す", meaning: "hand over" },
  { root: "指", word: "指す", readingRoot: "さ", ending: "す", meaning: "point" },
  { root: "申", word: "申す", readingRoot: "もう", ending: "す", meaning: "say humbly" },
  { root: "外", word: "外す", readingRoot: "はず", ending: "す", meaning: "remove / miss" },
  { root: "映", word: "映す", readingRoot: "うつ", ending: "す", meaning: "project / reflect" },
  { root: "隠", word: "隠す", readingRoot: "かく", ending: "す", meaning: "hide something" },
  { root: "許", word: "許す", readingRoot: "ゆる", ending: "す", meaning: "allow / forgive" },
  { root: "残", word: "残す", readingRoot: "のこ", ending: "す", meaning: "leave behind" },
  { root: "落と", word: "落とす", readingRoot: "おと", ending: "す", meaning: "drop" },
  { root: "起こ", word: "起こす", readingRoot: "おこ", ending: "す", meaning: "wake / cause" },
  { root: "壊", word: "壊す", readingRoot: "こわ", ending: "す", meaning: "break something" },
  { root: "増や", word: "増やす", readingRoot: "ふや", ending: "す", meaning: "increase something" },
  { root: "減ら", word: "減らす", readingRoot: "へら", ending: "す", meaning: "reduce something" },
  { root: "動か", word: "動かす", readingRoot: "うごか", ending: "す", meaning: "move something" },
  { root: "回", word: "回す", readingRoot: "まわ", ending: "す", meaning: "turn something" },
  { root: "伸ば", word: "伸ばす", readingRoot: "のば", ending: "す", meaning: "extend / grow" },
  { root: "飛ば", word: "飛ばす", readingRoot: "とば", ending: "す", meaning: "send flying" },
  { root: "冷や", word: "冷やす", readingRoot: "ひや", ending: "す", meaning: "chill" },
  { root: "沸か", word: "沸かす", readingRoot: "わか", ending: "す", meaning: "boil something" },
  { root: "鳴ら", word: "鳴らす", readingRoot: "なら", ending: "す", meaning: "ring / sound" },
  { root: "乾か", word: "乾かす", readingRoot: "かわか", ending: "す", meaning: "dry something" },
  { root: "待", word: "待つ", readingRoot: "ま", ending: "つ", meaning: "wait" },
  { root: "持", word: "持つ", readingRoot: "も", ending: "つ", meaning: "hold / have" },
  { root: "立", word: "立つ", readingRoot: "た", ending: "つ", meaning: "stand" },
  { root: "勝", word: "勝つ", readingRoot: "か", ending: "つ", meaning: "win" },
  { root: "打", word: "打つ", readingRoot: "う", ending: "つ", meaning: "hit" },
  { root: "経", word: "経つ", readingRoot: "た", ending: "つ", meaning: "pass / elapse" },
  { root: "目立", word: "目立つ", readingRoot: "めだ", ending: "つ", meaning: "stand out" },
  { root: "役立", word: "役立つ", readingRoot: "やくだ", ending: "つ", meaning: "be useful" },
  { root: "保", word: "保つ", readingRoot: "たも", ending: "つ", meaning: "maintain" },
  { root: "放", word: "放つ", readingRoot: "はな", ending: "つ", meaning: "release" },
  { root: "断", word: "断つ", readingRoot: "た", ending: "つ", meaning: "cut off" },
  { root: "育", word: "育つ", readingRoot: "そだ", ending: "つ", meaning: "grow up" },
  { root: "死", word: "死ぬ", readingRoot: "し", ending: "ぬ", meaning: "die" },
  { root: "遊", word: "遊ぶ", readingRoot: "あそ", ending: "ぶ", meaning: "play" },
  { root: "選", word: "選ぶ", readingRoot: "えら", ending: "ぶ", meaning: "choose" },
  { root: "呼", word: "呼ぶ", readingRoot: "よ", ending: "ぶ", meaning: "call" },
  { root: "飛", word: "飛ぶ", readingRoot: "と", ending: "ぶ", meaning: "fly" },
  { root: "運", word: "運ぶ", readingRoot: "はこ", ending: "ぶ", meaning: "carry / transport" },
  { root: "並", word: "並ぶ", readingRoot: "なら", ending: "ぶ", meaning: "line up" },
  { root: "喜", word: "喜ぶ", readingRoot: "よろこ", ending: "ぶ", meaning: "be delighted" },
  { root: "学", word: "学ぶ", readingRoot: "まな", ending: "ぶ", meaning: "learn / study" },
  { root: "結", word: "結ぶ", readingRoot: "むす", ending: "ぶ", meaning: "tie / connect" },
  { root: "転", word: "転ぶ", readingRoot: "ころ", ending: "ぶ", meaning: "fall over" },
  { root: "浮か", word: "浮かぶ", readingRoot: "うか", ending: "ぶ", meaning: "float / come to mind" },
  { root: "叫", word: "叫ぶ", readingRoot: "さけ", ending: "ぶ", meaning: "shout" },
  { root: "忍", word: "忍ぶ", readingRoot: "しの", ending: "ぶ", meaning: "endure / conceal oneself" },
  { root: "滅", word: "滅ぶ", readingRoot: "ほろ", ending: "ぶ", meaning: "perish" },
  { root: "及", word: "及ぶ", readingRoot: "およ", ending: "ぶ", meaning: "reach / extend" },
  { root: "読", word: "読む", readingRoot: "よ", ending: "む", meaning: "read" },
  { root: "飲", word: "飲む", readingRoot: "の", ending: "む", meaning: "drink" },
  { root: "休", word: "休む", readingRoot: "やす", ending: "む", meaning: "rest" },
  { root: "住", word: "住む", readingRoot: "す", ending: "む", meaning: "live / reside" },
  { root: "頼", word: "頼む", readingRoot: "たの", ending: "む", meaning: "ask / request" },
  { root: "楽し", word: "楽しむ", readingRoot: "たのし", ending: "む", meaning: "enjoy" },
  { root: "悩", word: "悩む", readingRoot: "なや", ending: "む", meaning: "worry" },
  { root: "進", word: "進む", readingRoot: "すす", ending: "む", meaning: "advance" },
  { root: "包", word: "包む", readingRoot: "つつ", ending: "む", meaning: "wrap" },
  { root: "噛", word: "噛む", readingRoot: "か", ending: "む", meaning: "bite / chew" },
  { root: "混", word: "混む", readingRoot: "こ", ending: "む", meaning: "be crowded" },
  { root: "積", word: "積む", readingRoot: "つ", ending: "む", meaning: "stack / load" },
  { root: "盗", word: "盗む", readingRoot: "ぬす", ending: "む", meaning: "steal" },
  { root: "掴", word: "掴む", readingRoot: "つか", ending: "む", meaning: "grab" },
  { root: "沈", word: "沈む", readingRoot: "しず", ending: "む", meaning: "sink" },
  { root: "縮", word: "縮む", readingRoot: "ちぢ", ending: "む", meaning: "shrink" },
  { root: "膨ら", word: "膨らむ", readingRoot: "ふくら", ending: "む", meaning: "swell" },
  { root: "挟", word: "挟む", readingRoot: "はさ", ending: "む", meaning: "sandwich / pinch" },
  { root: "望", word: "望む", readingRoot: "のぞ", ending: "む", meaning: "hope / desire" },
  { root: "好", word: "好む", readingRoot: "この", ending: "む", meaning: "prefer" },
  { root: "踏", word: "踏む", readingRoot: "ふ", ending: "む", meaning: "step on" },
  { root: "含", word: "含む", readingRoot: "ふく", ending: "む", meaning: "contain" },
  { root: "生", word: "生む", readingRoot: "う", ending: "む", meaning: "give birth / produce" },
  { root: "取り組", word: "取り組む", readingRoot: "とりく", ending: "む", meaning: "work on / tackle" },
  { root: "申し込", word: "申し込む", readingRoot: "もうしこ", ending: "む", meaning: "apply / sign up" },
  { root: "帰", word: "帰る", readingRoot: "かえ", ending: "る", meaning: "return home" },
  { root: "取", word: "取る", readingRoot: "と", ending: "る", meaning: "take" },
  { root: "作", word: "作る", readingRoot: "つく", ending: "る", meaning: "make" },
  { root: "売", word: "売る", readingRoot: "う", ending: "る", meaning: "sell" },
  { root: "送", word: "送る", readingRoot: "おく", ending: "る", meaning: "send" },
  { root: "切", word: "切る", readingRoot: "き", ending: "る", meaning: "cut" },
  { root: "走", word: "走る", readingRoot: "はし", ending: "る", meaning: "run" },
  { root: "入", word: "入る", readingRoot: "はい", ending: "る", meaning: "enter" },
  { root: "知", word: "知る", readingRoot: "し", ending: "る", meaning: "know" },
  { root: "要", word: "要る", readingRoot: "い", ending: "る", meaning: "need" },
  { root: "座", word: "座る", readingRoot: "すわ", ending: "る", meaning: "sit" },
  { root: "触", word: "触る", readingRoot: "さわ", ending: "る", meaning: "touch" },
  { root: "減", word: "減る", readingRoot: "へ", ending: "る", meaning: "decrease" },
  { root: "滑", word: "滑る", readingRoot: "すべ", ending: "る", meaning: "slip / slide" },
  { root: "蹴", word: "蹴る", readingRoot: "け", ending: "る", meaning: "kick" },
  { root: "握", word: "握る", readingRoot: "にぎ", ending: "る", meaning: "grip" },
  { root: "喋", word: "喋る", readingRoot: "しゃべ", ending: "る", meaning: "chat / speak" },
  { root: "渡", word: "渡る", readingRoot: "わた", ending: "る", meaning: "cross" },
  { root: "曲が", word: "曲がる", readingRoot: "まが", ending: "る", meaning: "turn / bend" },
  { root: "上が", word: "上がる", readingRoot: "あが", ending: "る", meaning: "rise" },
  { root: "下が", word: "下がる", readingRoot: "さが", ending: "る", meaning: "go down" },
  { root: "始ま", word: "始まる", readingRoot: "はじま", ending: "る", meaning: "begin" },
  { root: "終わ", word: "終わる", readingRoot: "おわ", ending: "る", meaning: "end" },
  { root: "決ま", word: "決まる", readingRoot: "きま", ending: "る", meaning: "be decided" },
  { root: "集ま", word: "集まる", readingRoot: "あつま", ending: "る", meaning: "gather" },
  { root: "困", word: "困る", readingRoot: "こま", ending: "る", meaning: "be troubled" },
  { root: "守", word: "守る", readingRoot: "まも", ending: "る", meaning: "protect / obey" },
  { root: "怒", word: "怒る", readingRoot: "おこ", ending: "る", meaning: "get angry" },
  { root: "祈", word: "祈る", readingRoot: "いの", ending: "る", meaning: "pray" },
  { root: "踊", word: "踊る", readingRoot: "おど", ending: "る", meaning: "dance" },
  { root: "残", word: "残る", readingRoot: "のこ", ending: "る", meaning: "remain" },
  { root: "眠", word: "眠る", readingRoot: "ねむ", ending: "る", meaning: "sleep" },
  { root: "乗", word: "乗る", readingRoot: "の", ending: "る", meaning: "ride" },
  { root: "太", word: "太る", readingRoot: "ふと", ending: "る", meaning: "gain weight" },
  { root: "配", word: "配る", readingRoot: "くば", ending: "る", meaning: "distribute" },
  { root: "断", word: "断る", readingRoot: "ことわ", ending: "る", meaning: "decline / refuse" },
  { root: "振", word: "振る", readingRoot: "ふ", ending: "る", meaning: "shake / wave" },
  { root: "降", word: "降る", readingRoot: "ふ", ending: "る", meaning: "fall (rain/snow)" },
  { root: "参", word: "参る", readingRoot: "まい", ending: "る", meaning: "go / come humbly" },
  { root: "戻", word: "戻る", readingRoot: "もど", ending: "る", meaning: "return" },
  { root: "回", word: "回る", readingRoot: "まわ", ending: "る", meaning: "turn / go around" },
  { root: "光", word: "光る", readingRoot: "ひか", ending: "る", meaning: "shine" },
  { root: "頑張", word: "頑張る", readingRoot: "がんば", ending: "る", meaning: "do one's best" },
  { root: "分か", word: "分かる", readingRoot: "わか", ending: "る", meaning: "understand" },
  { root: "預か", word: "預かる", readingRoot: "あずか", ending: "る", meaning: "look after / hold" },
  { root: "助か", word: "助かる", readingRoot: "たすか", ending: "る", meaning: "be saved / helped" },
  { root: "被", word: "被る", readingRoot: "かぶ", ending: "る", meaning: "put on / suffer" },
  { root: "混じ", word: "混じる", readingRoot: "まじ", ending: "る", meaning: "mix / be mixed" },
  { root: "限", word: "限る", readingRoot: "かぎ", ending: "る", meaning: "limit" },
  { root: "焦", word: "焦る", readingRoot: "あせ", ending: "る", meaning: "be impatient" },
  { root: "謝", word: "謝る", readingRoot: "あやま", ending: "る", meaning: "apologize" },
  { root: "黙", word: "黙る", readingRoot: "だま", ending: "る", meaning: "be silent" },
  { root: "迫", word: "迫る", readingRoot: "せま", ending: "る", meaning: "approach / press" },
  { root: "捻", word: "捻る", readingRoot: "ひね", ending: "る", meaning: "twist" },
  { root: "練", word: "練る", readingRoot: "ね", ending: "る", meaning: "knead / refine" },
];


export const NON_GODAN_VERBS: NonGodanVerb[] = [
  { kind: "ichidan", root: "食べ", word: "食べる", readingRoot: "たべ", meaning: "eat" },
  { kind: "ichidan", root: "見", word: "見る", readingRoot: "み", meaning: "see / watch" },
  { kind: "ichidan", root: "起き", word: "起きる", readingRoot: "おき", meaning: "wake up" },
  { kind: "ichidan", root: "寝", word: "寝る", readingRoot: "ね", meaning: "sleep / go to bed" },
  { kind: "ichidan", root: "教え", word: "教える", readingRoot: "おしえ", meaning: "teach / tell" },
  { kind: "ichidan", root: "覚え", word: "覚える", readingRoot: "おぼえ", meaning: "remember / learn" },
  { kind: "ichidan", root: "忘れ", word: "忘れる", readingRoot: "わすれ", meaning: "forget" },
  { kind: "ichidan", root: "借り", word: "借りる", readingRoot: "かり", meaning: "borrow" },
  { kind: "ichidan", root: "浴び", word: "浴びる", readingRoot: "あび", meaning: "bathe / shower" },
  { kind: "ichidan", root: "降り", word: "降りる", readingRoot: "おり", meaning: "get off / descend" },
  { kind: "ichidan", root: "着", word: "着る", readingRoot: "き", meaning: "wear / put on" },
  { kind: "ichidan", root: "開け", word: "開ける", readingRoot: "あけ", meaning: "open something" },
  { kind: "ichidan", root: "閉め", word: "閉める", readingRoot: "しめ", meaning: "close something" },
  { kind: "ichidan", root: "始め", word: "始める", readingRoot: "はじめ", meaning: "begin something" },
  { kind: "ichidan", root: "決め", word: "決める", readingRoot: "きめ", meaning: "decide something" },
  { kind: "ichidan", root: "集め", word: "集める", readingRoot: "あつめ", meaning: "collect / gather things" },
  { kind: "ichidan", root: "調べ", word: "調べる", readingRoot: "しらべ", meaning: "check / investigate" },
  { kind: "ichidan", root: "考え", word: "考える", readingRoot: "かんがえ", meaning: "think / consider" },
  { kind: "ichidan", root: "答え", word: "答える", readingRoot: "こたえ", meaning: "answer" },
  { kind: "ichidan", root: "信じ", word: "信じる", readingRoot: "しんじ", meaning: "believe" },
  { kind: "suru", root: "", word: "する", readingRoot: "", meaning: "do" },
  { kind: "kuru", root: "来", word: "来る", readingRoot: "", meaning: "come" },
];

export function isGodanVerb(verb: ConjugationVerb): verb is GodanVerb {
  return "ending" in verb;
}

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


const ICHIDAN_SUFFIXES: Record<ConjugationTarget, string> = {
  negative: "ない",
  polite: "ます",
  potential: "られる",
  volitional: "よう",
};

const SURU_FORMS: Record<ConjugationTarget, { word: string; reading: string }> = {
  negative: { word: "しない", reading: "しない" },
  polite: { word: "します", reading: "します" },
  potential: { word: "できる", reading: "できる" },
  volitional: { word: "しよう", reading: "しよう" },
};

const KURU_FORMS: Record<ConjugationTarget, { word: string; reading: string }> = {
  negative: { word: "来ない", reading: "こない" },
  polite: { word: "来ます", reading: "きます" },
  potential: { word: "来られる", reading: "こられる" },
  volitional: { word: "来よう", reading: "こよう" },
};

export function conjugateVerb(
  verb: ConjugationVerb,
  target: ConjugationTarget,
) {
  if (isGodanVerb(verb)) {
    return conjugateGodan(verb, target);
  }

  if (verb.kind === "ichidan") {
    return `${verb.root}${ICHIDAN_SUFFIXES[target]}`;
  }

  if (verb.kind === "suru") {
    return SURU_FORMS[target].word;
  }

  return KURU_FORMS[target].word;
}

export function conjugateReading(
  verb: ConjugationVerb,
  target: ConjugationTarget,
) {
  if (isGodanVerb(verb)) {
    const meta = TARGETS[target];
    return `${verb.readingRoot}${rowKana(verb, meta.row)}${meta.suffix}`;
  }

  if (verb.kind === "ichidan") {
    return `${verb.readingRoot}${ICHIDAN_SUFFIXES[target]}`;
  }

  if (verb.kind === "suru") {
    return SURU_FORMS[target].reading;
  }

  return KURU_FORMS[target].reading;
}

export function conjugationChoice(
  verb: ConjugationVerb,
  target: ConjugationTarget,
) {
  if (isGodanVerb(verb)) {
    return rowEnding(verb, TARGETS[target].row);
  }

  if (verb.kind === "ichidan") {
    return ICHIDAN_SUFFIXES[target];
  }

  if (verb.kind === "suru") {
    return SURU_FORMS[target].word;
  }

  return KURU_FORMS[target].word;
}

export function conjugationDetail(
  verb: ConjugationVerb,
  target: ConjugationTarget,
) {
  if (isGodanVerb(verb)) {
    const sourceKana = verb.ending;
    const targetKana = rowKana(verb, TARGETS[target].row);
    const suffix = TARGETS[target].suffix;
    return suffix
      ? `${sourceKana} → ${targetKana} + ${suffix}`
      : `${sourceKana} → ${targetKana}`;
  }

  if (verb.kind === "ichidan") {
    return `drop る + ${ICHIDAN_SUFFIXES[target]}`;
  }

  if (verb.kind === "suru") {
    return `する → ${SURU_FORMS[target].word}`;
  }

  return `来る → ${KURU_FORMS[target].word}`;
}


export type PairRule = "aru" | "mu" | "bu" | "tsu" | "su" | "flip";

export const PAIR_RULE_LABELS: Record<PairRule, string> = {
  aru: "A-row + る = SELF",
  mu: "〜む → 〜める · める = OTHER",
  bu: "〜ぶ → 〜べる · べる = OTHER",
  tsu: "〜つ → 〜てる · てる = OTHER",
  su: "〜す = OTHER",
  flip: "U ↔ E + る = FLIP",
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
    stem: "止",
    self: "止まる",
    selfEnding: "まる",
    selfGloss: "to stop",
    other: "止める",
    otherEnding: "める",
    otherGloss: "to stop something",
    rule: "aru",
  },
  {
    stem: "広",
    self: "広がる",
    selfEnding: "がる",
    selfGloss: "to spread / widen",
    other: "広げる",
    otherEnding: "げる",
    otherGloss: "to spread / widen something",
    rule: "aru",
  },
  {
    stem: "深",
    self: "深まる",
    selfEnding: "まる",
    selfGloss: "to deepen",
    other: "深める",
    otherEnding: "める",
    otherGloss: "to deepen something",
    rule: "aru",
  },
  {
    stem: "高",
    self: "高まる",
    selfEnding: "まる",
    selfGloss: "to rise / heighten",
    other: "高める",
    otherEnding: "める",
    otherGloss: "to raise / heighten something",
    rule: "aru",
  },
  {
    stem: "強",
    self: "強まる",
    selfEnding: "まる",
    selfGloss: "to grow stronger",
    other: "強める",
    otherEnding: "める",
    otherGloss: "to strengthen something",
    rule: "aru",
  },
  {
    stem: "弱",
    self: "弱まる",
    selfEnding: "まる",
    selfGloss: "to grow weaker",
    other: "弱める",
    otherEnding: "める",
    otherGloss: "to weaken something",
    rule: "aru",
  },
  {
    stem: "固",
    self: "固まる",
    selfEnding: "まる",
    selfGloss: "to harden / solidify",
    other: "固める",
    otherEnding: "める",
    otherGloss: "to harden / solidify something",
    rule: "aru",
  },
  {
    stem: "温",
    self: "温まる",
    selfEnding: "まる",
    selfGloss: "to warm up",
    other: "温める",
    otherEnding: "める",
    otherGloss: "to warm something",
    rule: "aru",
  },
  {
    stem: "丸",
    self: "丸まる",
    selfEnding: "まる",
    selfGloss: "to curl up / become round",
    other: "丸める",
    otherEnding: "める",
    otherGloss: "to roll / round something",
    rule: "aru",
  },
  {
    stem: "曲",
    self: "曲がる",
    selfEnding: "がる",
    selfGloss: "to bend / turn",
    other: "曲げる",
    otherEnding: "げる",
    otherGloss: "to bend something",
    rule: "aru",
  },
  {
    stem: "繋",
    self: "繋がる",
    selfEnding: "がる",
    selfGloss: "to be connected",
    other: "繋げる",
    otherEnding: "げる",
    otherGloss: "to connect something",
    rule: "aru",
  },
  {
    stem: "見つ",
    self: "見つかる",
    selfEnding: "かる",
    selfGloss: "to be found",
    other: "見つける",
    otherEnding: "ける",
    otherGloss: "to find something",
    rule: "aru",
  },
  {
    stem: "掛",
    self: "掛かる",
    selfEnding: "かる",
    selfGloss: "to be hung / take effect",
    other: "掛ける",
    otherEnding: "ける",
    otherGloss: "to hang / apply something",
    rule: "aru",
  },
  {
    stem: "泊",
    self: "泊まる",
    selfEnding: "まる",
    selfGloss: "to stay overnight",
    other: "泊める",
    otherEnding: "める",
    otherGloss: "to let someone stay overnight",
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
    otherGloss: "to shorten / shrink something",
    rule: "mu",
  },
  {
    stem: "進",
    self: "進む",
    selfEnding: "む",
    selfGloss: "to advance",
    other: "進める",
    otherEnding: "める",
    otherGloss: "to advance something",
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
    stem: "浮",
    self: "浮かぶ",
    selfEnding: "かぶ",
    selfGloss: "to float / come to mind",
    other: "浮かべる",
    otherEnding: "かべる",
    otherGloss: "to float / bring something to mind",
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
    stem: "建",
    self: "建つ",
    selfEnding: "つ",
    selfGloss: "to be built",
    other: "建てる",
    otherEnding: "てる",
    otherGloss: "to build something",
    rule: "tsu",
  },
  {
    stem: "役立",
    self: "役立つ",
    selfEnding: "つ",
    selfGloss: "to be useful",
    other: "役立てる",
    otherEnding: "てる",
    otherGloss: "to make use of something",
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
  {
    stem: "起",
    self: "起きる",
    selfEnding: "きる",
    selfGloss: "to wake up",
    other: "起こす",
    otherEnding: "こす",
    otherGloss: "to wake someone / cause something",
    rule: "su",
  },
  {
    stem: "壊",
    self: "壊れる",
    selfEnding: "れる",
    selfGloss: "to break",
    other: "壊す",
    otherEnding: "す",
    otherGloss: "to break something",
    rule: "su",
  },
  {
    stem: "汚",
    self: "汚れる",
    selfEnding: "れる",
    selfGloss: "to get dirty",
    other: "汚す",
    otherEnding: "す",
    otherGloss: "to dirty something",
    rule: "su",
  },
  {
    stem: "倒",
    self: "倒れる",
    selfEnding: "れる",
    selfGloss: "to fall over",
    other: "倒す",
    otherEnding: "す",
    otherGloss: "to knock something over",
    rule: "su",
  },
  {
    stem: "冷",
    self: "冷める",
    selfEnding: "める",
    selfGloss: "to cool down",
    other: "冷ます",
    otherEnding: "ます",
    otherGloss: "to cool something down",
    rule: "su",
  },
  {
    stem: "覚",
    self: "覚める",
    selfEnding: "める",
    selfGloss: "to wake / become alert",
    other: "覚ます",
    otherEnding: "ます",
    otherGloss: "to wake someone / snap out of it",
    rule: "su",
  },
  {
    stem: "増",
    self: "増える",
    selfEnding: "える",
    selfGloss: "to increase",
    other: "増やす",
    otherEnding: "やす",
    otherGloss: "to increase something",
    rule: "su",
  },
  {
    stem: "減",
    self: "減る",
    selfEnding: "る",
    selfGloss: "to decrease",
    other: "減らす",
    otherEnding: "らす",
    otherGloss: "to reduce something",
    rule: "su",
  },
  {
    stem: "動",
    self: "動く",
    selfEnding: "く",
    selfGloss: "to move",
    other: "動かす",
    otherEnding: "かす",
    otherGloss: "to move something",
    rule: "su",
  },
  {
    stem: "乾",
    self: "乾く",
    selfEnding: "く",
    selfGloss: "to dry",
    other: "乾かす",
    otherEnding: "かす",
    otherGloss: "to dry something",
    rule: "su",
  },
  {
    stem: "沸",
    self: "沸く",
    selfEnding: "く",
    selfGloss: "to boil",
    other: "沸かす",
    otherEnding: "かす",
    otherGloss: "to boil something",
    rule: "su",
  },
  {
    stem: "鳴",
    self: "鳴る",
    selfEnding: "る",
    selfGloss: "to ring / sound",
    other: "鳴らす",
    otherEnding: "らす",
    otherGloss: "to ring / sound something",
    rule: "su",
  },
  {
    stem: "回",
    self: "回る",
    selfEnding: "る",
    selfGloss: "to turn / go around",
    other: "回す",
    otherEnding: "す",
    otherGloss: "to turn something",
    rule: "su",
  },
  {
    stem: "飛",
    self: "飛ぶ",
    selfEnding: "ぶ",
    selfGloss: "to fly",
    other: "飛ばす",
    otherEnding: "ばす",
    otherGloss: "to send something flying",
    rule: "su",
  },
  {
    stem: "冷",
    self: "冷える",
    selfEnding: "える",
    selfGloss: "to become cold",
    other: "冷やす",
    otherEnding: "やす",
    otherGloss: "to chill something",
    rule: "su",
  },
  {
    stem: "離",
    self: "離れる",
    selfEnding: "れる",
    selfGloss: "to separate / move away",
    other: "離す",
    otherEnding: "す",
    otherGloss: "to separate something",
    rule: "su",
  },
  {
    stem: "逃",
    self: "逃げる",
    selfEnding: "げる",
    selfGloss: "to escape",
    other: "逃がす",
    otherEnding: "がす",
    otherGloss: "to let something escape",
    rule: "su",
  },
  {
    stem: "溶",
    self: "溶ける",
    selfEnding: "ける",
    selfGloss: "to melt",
    other: "溶かす",
    otherEnding: "かす",
    otherGloss: "to melt something",
    rule: "su",
  },
  {
    stem: "隠",
    self: "隠れる",
    selfEnding: "れる",
    selfGloss: "to hide / be hidden",
    other: "隠す",
    otherEnding: "す",
    otherGloss: "to hide something",
    rule: "su",
  },
  {
    stem: "外",
    self: "外れる",
    selfEnding: "れる",
    selfGloss: "to come off",
    other: "外す",
    otherEnding: "す",
    otherGloss: "to remove something",
    rule: "su",
  },
  {
    stem: "残",
    self: "残る",
    selfEnding: "る",
    selfGloss: "to remain",
    other: "残す",
    otherEnding: "す",
    otherGloss: "to leave something",
    rule: "su",
  },
  {
    stem: "移",
    self: "移る",
    selfEnding: "る",
    selfGloss: "to move / transfer",
    other: "移す",
    otherEnding: "す",
    otherGloss: "to move / transfer something",
    rule: "su",
  },
  {
    stem: "写",
    self: "写る",
    selfEnding: "る",
    selfGloss: "to appear in a photo",
    other: "写す",
    otherEnding: "す",
    otherGloss: "to photograph / copy something",
    rule: "su",
  },
  {
    stem: "治",
    self: "治る",
    selfEnding: "る",
    selfGloss: "to recover / be cured",
    other: "治す",
    otherEnding: "す",
    otherGloss: "to cure / repair something",
    rule: "su",
  },
  {
    stem: "戻",
    self: "戻る",
    selfEnding: "る",
    selfGloss: "to return",
    other: "戻す",
    otherEnding: "す",
    otherGloss: "to put something back",
    rule: "su",
  },
  {
    stem: "起",
    self: "起こる",
    selfEnding: "こる",
    selfGloss: "to occur",
    other: "起こす",
    otherEnding: "こす",
    otherGloss: "to cause something",
    rule: "su",
  },
  {
    stem: "燃",
    self: "燃える",
    selfEnding: "える",
    selfGloss: "to burn",
    other: "燃やす",
    otherEnding: "やす",
    otherGloss: "to burn something",
    rule: "su",
  },
  {
    stem: "生",
    self: "生える",
    selfEnding: "える",
    selfGloss: "to grow",
    other: "生やす",
    otherEnding: "やす",
    otherGloss: "to grow something",
    rule: "su",
  },
  {
    stem: "揺",
    self: "揺れる",
    selfEnding: "れる",
    selfGloss: "to shake / sway",
    other: "揺らす",
    otherEnding: "らす",
    otherGloss: "to shake something",
    rule: "su",
  },
  {
    stem: "散",
    self: "散る",
    selfEnding: "る",
    selfGloss: "to scatter / fall",
    other: "散らす",
    otherEnding: "らす",
    otherGloss: "to scatter something",
    rule: "su",
  },
  {
    stem: "乱",
    self: "乱れる",
    selfEnding: "れる",
    selfGloss: "to become disordered",
    other: "乱す",
    otherEnding: "す",
    otherGloss: "to disrupt something",
    rule: "su",
  },
  {
    stem: "崩",
    self: "崩れる",
    selfEnding: "れる",
    selfGloss: "to crumble",
    other: "崩す",
    otherEnding: "す",
    otherGloss: "to break / demolish something",
    rule: "su",
  },
  {
    stem: "潰",
    self: "潰れる",
    selfEnding: "れる",
    selfGloss: "to be crushed",
    other: "潰す",
    otherEnding: "す",
    otherGloss: "to crush something",
    rule: "su",
  },
  {
    stem: "濡",
    self: "濡れる",
    selfEnding: "れる",
    selfGloss: "to get wet",
    other: "濡らす",
    otherEnding: "らす",
    otherGloss: "to wet something",
    rule: "su",
  },
  {
    stem: "開",
    self: "開く",
    selfEnding: "く",
    selfGloss: "to open",
    other: "開ける",
    otherEnding: "ける",
    otherGloss: "to open something",
    rule: "flip",
  },
  {
    stem: "付",
    self: "付く",
    selfEnding: "く",
    selfGloss: "to attach / be on",
    other: "付ける",
    otherEnding: "ける",
    otherGloss: "to attach something",
    rule: "flip",
  },
  {
    stem: "続",
    self: "続く",
    selfEnding: "く",
    selfGloss: "to continue",
    other: "続ける",
    otherEnding: "ける",
    otherGloss: "to continue something",
    rule: "flip",
  },
  {
    stem: "届",
    self: "届く",
    selfEnding: "く",
    selfGloss: "to reach / arrive",
    other: "届ける",
    otherEnding: "ける",
    otherGloss: "to deliver something",
    rule: "flip",
  },
  {
    stem: "向",
    self: "向く",
    selfEnding: "く",
    selfGloss: "to face / turn",
    other: "向ける",
    otherEnding: "ける",
    otherGloss: "to turn something toward",
    rule: "flip",
  },
  {
    stem: "傾",
    self: "傾く",
    selfEnding: "く",
    selfGloss: "to tilt",
    other: "傾ける",
    otherEnding: "ける",
    otherGloss: "to tilt something",
    rule: "flip",
  },
  {
    stem: "近づ",
    self: "近づく",
    selfEnding: "く",
    selfGloss: "to approach",
    other: "近づける",
    otherEnding: "ける",
    otherGloss: "to bring something closer",
    rule: "flip",
  },
  {
    stem: "入",
    self: "入る",
    selfEnding: "る",
    selfGloss: "to enter",
    other: "入れる",
    otherEnding: "れる",
    otherGloss: "to put something in",
    rule: "flip",
  },
  {
    stem: "切",
    self: "切れる",
    selfEnding: "れる",
    selfGloss: "to be cut / snap",
    other: "切る",
    otherEnding: "る",
    otherGloss: "to cut something",
    rule: "flip",
  },
  {
    stem: "割",
    self: "割れる",
    selfEnding: "れる",
    selfGloss: "to break / crack",
    other: "割る",
    otherEnding: "る",
    otherGloss: "to break something",
    rule: "flip",
  },
  {
    stem: "折",
    self: "折れる",
    selfEnding: "れる",
    selfGloss: "to break / bend",
    other: "折る",
    otherEnding: "る",
    otherGloss: "to break / fold something",
    rule: "flip",
  },
  {
    stem: "破",
    self: "破れる",
    selfEnding: "れる",
    selfGloss: "to tear",
    other: "破る",
    otherEnding: "る",
    otherGloss: "to tear something",
    rule: "flip",
  },
  {
    stem: "抜",
    self: "抜ける",
    selfEnding: "ける",
    selfGloss: "to come out",
    other: "抜く",
    otherEnding: "く",
    otherGloss: "to pull something out",
    rule: "flip",
  },
  {
    stem: "解",
    self: "解ける",
    selfEnding: "ける",
    selfGloss: "to come undone / be solved",
    other: "解く",
    otherEnding: "く",
    otherGloss: "to untie / solve something",
    rule: "flip",
  },
  {
    stem: "焼",
    self: "焼ける",
    selfEnding: "ける",
    selfGloss: "to be cooked / baked",
    other: "焼く",
    otherEnding: "く",
    otherGloss: "to cook / bake something",
    rule: "flip",
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
