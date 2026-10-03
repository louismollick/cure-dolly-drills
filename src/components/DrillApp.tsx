import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  conjugateGodan,
  GODAN_VERBS,
  PAIR_RULE_LABELS,
  ROWS,
  rowEnding,
  rowKana,
  shuffle,
  TARGETS,
  type ConjugationTarget,
  type GodanVerb,
  type RowKey,
  VERB_PAIRS,
  type VerbPair,
} from "@/lib/drills";
import { cn } from "@/lib/utils";

type Mode = "conjugation" | "pairs";
type Difficulty = "guided" | "practice" | "recall";
type Direction = "self" | "other";

type ConjugationQuestion = {
  verb: GodanVerb;
  target: ConjugationTarget;
};

type PairQuestion = {
  pair: VerbPair;
  target: Direction;
};

type Feedback = {
  correct: boolean;
  text: string;
  selected: string;
};

const targetKeys = Object.keys(TARGETS) as ConjugationTarget[];

const CONJUGATION_RULE_EXAMPLES: Record<RowKey, { japanese: string; english: string }> = {
  a: { japanese: "書く → 書かない", english: "write → do not write" },
  i: { japanese: "書く → 書きます", english: "write → write (polite)" },
  u: { japanese: "書く", english: "to write" },
  e: { japanese: "書く → 書ける", english: "write → can write" },
  o: { japanese: "書く → 書こう", english: "write → let's write" },
};

const TRANSITIVITY_RULES = [
  {
    label: "〜す = OTHER",
    japanese: "出る → 出す",
    english: "come out → take something out",
  },
  {
    label: "A-row + る = SELF",
    japanese: "閉める ↔ 閉まる",
    english: "shut something ↔ be shut",
  },
  {
    label: "U → E + る = FLIP",
    japanese: "沈む → 沈める",
    english: "sink → sink something",
  },
  {
    label: "〜める / 〜べる / 〜てる = OTHER",
    japanese: "並ぶ → 並べる",
    english: "line up → arrange things",
  },
] as const;

function randomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function makeConjugationQuestion(
  previous?: ConjugationQuestion,
): ConjugationQuestion {
  let next: ConjugationQuestion;

  do {
    next = {
      verb: randomItem(GODAN_VERBS),
      target: randomItem(targetKeys),
    };
  } while (
    previous &&
    next.verb.word === previous.verb.word &&
    next.target === previous.target
  );

  return next;
}

function makePairQuestion(previous?: PairQuestion): PairQuestion {
  let next: PairQuestion;

  do {
    next = {
      pair: randomItem(VERB_PAIRS),
      target: Math.random() < 0.5 ? "self" : "other",
    };
  } while (
    previous &&
    next.pair.self === previous.pair.self &&
    next.target === previous.target
  );

  return next;
}

function ConjugationRules() {
  return (
    <div className="mx-auto grid max-w-3xl grid-cols-5 gap-px bg-zinc-800 text-center">
      {ROWS.map((row) => {
        const example = CONJUGATION_RULE_EXAMPLES[row.key];

        return (
          <Tooltip key={row.key}>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="bg-black px-1 py-2 text-center outline-none focus-visible:bg-zinc-950"
              >
                <div className="text-base">{row.kana}</div>
                <div className="mt-0.5 text-[11px] text-zinc-400">
                  {row.label}
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="font-medium">{example.japanese}</div>
              <div className="mt-0.5 text-zinc-400">{example.english}</div>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

function PairRules() {
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-zinc-300">
      {TRANSITIVITY_RULES.map((rule) => (
        <Tooltip key={rule.label}>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="border-b border-dotted border-zinc-600 text-zinc-300 outline-none hover:text-white focus-visible:text-white"
            >
              {rule.label}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="font-medium">{rule.japanese}</div>
            <div className="mt-0.5 text-zinc-400">{rule.english}</div>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

export default function DrillApp() {
  const [mode, setMode] = useState<Mode>("conjugation");
  const [difficulty, setDifficulty] = useState<Difficulty>("guided");
  const [rulesOpen, setRulesOpen] = useState(false);
  const [answerDelay, setAnswerDelay] = useState(850);
  const [conjugationQuestion, setConjugationQuestion] = useState(
    makeConjugationQuestion,
  );
  const [pairQuestion, setPairQuestion] = useState(makePairQuestion);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [locked, setLocked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const clearPending = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearPending, [clearPending]);

  const changeMode = (nextMode: Mode) => {
    clearPending();
    setMode(nextMode);
    setFeedback(null);
    setLocked(false);

    if (nextMode === "conjugation" && difficulty === "guided") {
      setRulesOpen(false);
    }
  };

  const changeDifficulty = (nextDifficulty: Difficulty) => {
    clearPending();
    setDifficulty(nextDifficulty);
    setFeedback(null);
    setLocked(false);

    if (nextDifficulty === "guided" && mode === "conjugation") {
      setRulesOpen(false);
    }
  };

  const finishAnswer = useCallback(
    (
      wasCorrect: boolean,
      text: string,
      selected: string,
      next: () => void,
    ) => {
      if (locked) return;

      setLocked(true);
      setFeedback({ correct: wasCorrect, text, selected });

      if (wasCorrect) {
        setCorrect((value) => value + 1);
      } else {
        setWrong((value) => value + 1);
      }

      timeoutRef.current = window.setTimeout(
        () => {
          next();
          setFeedback(null);
          setLocked(false);
          timeoutRef.current = null;
        },
        wasCorrect ? answerDelay : answerDelay + 400,
      );
    },
    [answerDelay, locked],
  );

  const conjugationOptions = useMemo(() => {
    const options = ROWS.filter((row) => row.key !== "u").map((row) => ({
      row: row.key,
      rowKana: rowKana(conjugationQuestion.verb, row.key),
      ending: rowEnding(conjugationQuestion.verb, row.key),
      rowLabel: row.kana,
      meaningLabel: row.label,
    }));

    return difficulty === "recall" ? shuffle(options) : options;
  }, [conjugationQuestion, difficulty]);

  const pairOptions = useMemo(() => {
    const { pair } = pairQuestion;
    const full = [
      {
        direction: "self" as const,
        word: pair.self,
        ending: pair.selfEnding,
        gloss: pair.selfGloss,
      },
      {
        direction: "other" as const,
        word: pair.other,
        ending: pair.otherEnding,
        gloss: pair.otherGloss,
      },
    ];

    return shuffle(full);
  }, [pairQuestion]);

  const answerConjugation = useCallback(
    (row: RowKey) => {
      const expected = TARGETS[conjugationQuestion.target].row;
      const wasCorrect = row === expected;
      const answer = conjugateGodan(
        conjugationQuestion.verb,
        conjugationQuestion.target,
      );
      const sourceKana = conjugationQuestion.verb.ending;
      const targetKana = rowKana(conjugationQuestion.verb, expected);
      const suffix = TARGETS[conjugationQuestion.target].suffix;
      const construction = suffix
        ? `${sourceKana} → ${targetKana} + ${suffix}`
        : `${sourceKana} → ${targetKana}`;

      finishAnswer(
        wasCorrect,
        `${answer} · ${construction}`,
        row,
        () =>
          setConjugationQuestion((current) =>
            makeConjugationQuestion(current),
          ),
      );
    },
    [conjugationQuestion, finishAnswer],
  );

  const answerPair = useCallback(
    (direction: Direction) => {
      const { pair, target } = pairQuestion;
      const wasCorrect = direction === target;
      const answer = target === "self" ? pair.self : pair.other;

      finishAnswer(
        wasCorrect,
        `${answer} · ${PAIR_RULE_LABELS[pair.rule]}`,
        direction,
        () => setPairQuestion((current) => makePairQuestion(current)),
      );
    },
    [finishAnswer, pairQuestion],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key.toLowerCase() === "r") {
        setRulesOpen((value) => !value);
        return;
      }

      const index = Number(event.key) - 1;
      if (!Number.isInteger(index) || index < 0) return;

      if (mode === "conjugation") {
        const option = conjugationOptions[index];
        if (option) answerConjugation(option.row);
        return;
      }

      const option = pairOptions[index];
      if (option) answerPair(option.direction);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    answerConjugation,
    answerPair,
    conjugationOptions,
    mode,
    pairOptions,
  ]);

  const attempts = correct + wrong;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex min-h-12 max-w-3xl flex-wrap items-center gap-1 px-3 sm:px-4">
          <Button
            className={cn(
              "h-12 rounded-none border-b-2 px-2",
              mode === "conjugation"
                ? "border-white text-white"
                : "border-transparent",
            )}
            variant="ghost"
            onClick={() => changeMode("conjugation")}
          >
            Conjugation
          </Button>
          <Button
            className={cn(
              "h-12 rounded-none border-b-2 px-2",
              mode === "pairs"
                ? "border-white text-white"
                : "border-transparent",
            )}
            variant="ghost"
            onClick={() => changeMode("pairs")}
          >
            Transitivity
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-xs tabular-nums text-zinc-500 sm:inline">
              {attempts === 0 ? "0/0" : `${correct}/${attempts}`}
            </span>

            <label className="sr-only" htmlFor="difficulty">
              Difficulty
            </label>
            <select
              id="difficulty"
              className="h-8 rounded-sm border border-zinc-700 bg-black px-2 text-xs text-white outline-none focus:border-white"
              value={difficulty}
              onChange={(event) =>
                changeDifficulty(event.target.value as Difficulty)
              }
            >
              <option value="guided">Guided</option>
              <option value="practice">Practice</option>
              <option value="recall">Recall</option>
            </select>

            <label className="sr-only" htmlFor="answer-delay">
              Delay between questions
            </label>
            <select
              id="answer-delay"
              aria-label="Delay between questions"
              title="Delay between questions"
              className="h-8 rounded-sm border border-zinc-700 bg-black px-2 text-xs text-white outline-none focus:border-white"
              value={answerDelay}
              onChange={(event) => setAnswerDelay(Number(event.target.value))}
            >
              <option value="650">0.65s</option>
              <option value="850">0.85s</option>
              <option value="1200">1.2s</option>
              <option value="1600">1.6s</option>
            </select>

            <Button
              aria-expanded={rulesOpen}
              className="h-8 px-2"
              size="sm"
              variant="ghost"
              onClick={() => setRulesOpen((value) => !value)}
            >
              Rules
            </Button>
          </div>
        </div>
      </header>

      {rulesOpen && (
        <section
          className="border-b border-zinc-800 px-4 py-3"
          aria-label="Rules"
        >
          {mode === "conjugation" ? <ConjugationRules /> : <PairRules />}
        </section>
      )}

      <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        {mode === "conjugation" ? (
          <section className="text-center" aria-live="polite">
            <div className="text-base font-medium">
              {TARGETS[conjugationQuestion.target].label}
            </div>
            <div className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              {conjugationQuestion.verb.word}
            </div>
            <div className="mt-2 text-sm text-zinc-400">
              {conjugationQuestion.verb.meaning}
            </div>

            <div className="mt-9 grid grid-cols-4 gap-2">
              {conjugationOptions.map((option, index) => (
                <Button
                  key={option.row}
                  className={cn(
                    "h-20 min-w-0 flex-col gap-1 px-1",
                    locked &&
                      feedback &&
                      !feedback.correct &&
                      feedback.selected === option.row &&
                      "border-red-500 bg-red-950/20 text-red-400 disabled:opacity-100",
                  )}
                  disabled={locked}
                  variant="outline"
                  onClick={() => answerConjugation(option.row)}
                  aria-label={`Answer ${index + 1}: ${option.ending}`}
                >
                  {difficulty === "guided" && (
                    <span className="text-[10px] font-normal text-zinc-500">
                      {option.rowLabel} · {option.meaningLabel}
                    </span>
                  )}
                  <span className="text-xl font-normal sm:text-2xl">
                    {difficulty === "guided"
                      ? option.ending
                      : option.rowKana}
                  </span>
                  <span className="text-[10px] font-normal text-zinc-600">
                    {index + 1}
                  </span>
                </Button>
              ))}
            </div>
          </section>
        ) : (
          <section className="text-center" aria-live="polite">
            <div className="text-base font-medium">
              {pairQuestion.target === "self"
                ? pairQuestion.pair.selfGloss
                : pairQuestion.pair.otherGloss}
              {difficulty === "guided" && (
                <span className="text-zinc-500">
                  {" "}
                  · {pairQuestion.target.toUpperCase()}
                </span>
              )}
            </div>

            <div className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              {difficulty === "recall" ? `${pairQuestion.pair.stem}＿` : "?"}
            </div>

            {difficulty === "guided" && (
              <div className="mt-3 text-xs text-zinc-500">
                {PAIR_RULE_LABELS[pairQuestion.pair.rule]}
              </div>
            )}

            <div className="mx-auto mt-9 grid max-w-md grid-cols-2 gap-2">
              {pairOptions.map((option, index) => (
                <Button
                  key={option.direction}
                  className={cn(
                    "flex-col gap-1",
                    locked ? "h-24" : "h-20",
                    locked &&
                      feedback &&
                      !feedback.correct &&
                      feedback.selected === option.direction &&
                      "border-red-500 bg-red-950/20 text-red-400 disabled:opacity-100",
                  )}
                  disabled={locked}
                  variant="outline"
                  onClick={() => answerPair(option.direction)}
                >
                  <span className="text-2xl font-normal">
                    {difficulty === "recall"
                      ? `〜${option.ending}`
                      : option.word}
                  </span>
                  {locked && (
                    <span className="max-w-full whitespace-normal text-center text-xs font-normal leading-snug text-zinc-400">
                      {option.gloss}
                    </span>
                  )}
                  <span className="text-[10px] font-normal text-zinc-600">
                    {index + 1}
                  </span>
                </Button>
              ))}
            </div>
          </section>
        )}

        <div className="mt-7 min-h-7 text-center text-sm" aria-live="assertive">
          {feedback && (
            <span className={feedback.correct ? "text-white" : "text-red-400"}>
              {feedback.correct ? "✓" : "✕"} {feedback.text}
            </span>
          )}
        </div>
      </main>
    </div>
    </TooltipProvider>
  );
}
