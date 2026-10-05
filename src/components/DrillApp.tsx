import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  conjugateReading,
  conjugateVerb,
  conjugationChoice,
  conjugationDetail,
  GODAN_VERBS,
  isGodanVerb,
  NON_GODAN_VERBS,
  PAIR_RULE_LABELS,
  ROWS,
  rowEnding,
  rowKana,
  shuffle,
  TARGETS,
  type ConjugationTarget,
  type ConjugationVerb,
  type RowKey,
  VERB_PAIRS,
  type VerbPair,
} from "@/lib/drills";
import { cn } from "@/lib/utils";

type Mode = "conjugation" | "pairs";
type Difficulty = "guided" | "practice" | "recall";
type Direction = "self" | "other";

type ConjugationQuestion = {
  verb: ConjugationVerb;
  target: ConjugationTarget;
};

type PairQuestion = {
  pair: VerbPair;
  target: Direction;
};

type Feedback = {
  correct: boolean;
  answer: string;
  reading?: string;
  detail?: string;
  selected: string;
};

type ConjugationReview = {
  question: ConjugationQuestion;
  difficulty: Difficulty;
  feedback: Feedback;
};

type PairReview = {
  question: PairQuestion;
  difficulty: Difficulty;
  feedback: Feedback;
};

type ConjugationOption = {
  row: RowKey;
  rowKana: string;
  ending: string;
  rowLabel: string;
  meaningLabel: string;
};

const targetKeys = Object.keys(TARGETS) as ConjugationTarget[];

const CONJUGATION_RULE_EXAMPLES: Record<
  RowKey,
  { japanese: string; english: string }
> = {
  a: { japanese: "書く → 書かない", english: "write → do not write" },
  i: { japanese: "書く → 書きます", english: "write → write (polite)" },
  u: { japanese: "書く", english: "to write" },
  e: { japanese: "書く → 書ける", english: "write → can write" },
  o: { japanese: "書く → 書こう", english: "write → let's write" },
};

const NON_GODAN_RULES = [
  {
    label: "ICHIDAN: drop る + ない / ます / られる / よう",
    japanese: "食べる → 食べます",
    english: "eat → eat (polite)",
  },
  {
    label: "する: しない / します / できる / しよう",
    japanese: "する → できる",
    english: "do → can do",
  },
  {
    label: "来る: こない / きます / こられる / こよう",
    japanese: "来る → 来ます",
    english: "come → come (polite)",
  },
] as const;

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
    label: "U ↔ E + る = FLIP",
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
  difficulty: Difficulty = "guided",
): ConjugationQuestion {
  let next: ConjugationQuestion;

  do {
    const useNonGodan = difficulty === "recall" && Math.random() < 0.22;
    const pool: readonly ConjugationVerb[] = useNonGodan
      ? NON_GODAN_VERBS
      : GODAN_VERBS;

    next = {
      verb: randomItem(pool),
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

function RuleTooltip({
  label,
  japanese,
  english,
  className,
}: {
  label: string;
  japanese: string;
  english: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "border-b border-dotted border-zinc-600 text-zinc-300 outline-none hover:text-white focus-visible:text-white",
            className,
          )}
        >
          {label}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-base font-medium">{japanese}</div>
        <div className="mt-1 text-sm text-zinc-400">{english}</div>
      </TooltipContent>
    </Tooltip>
  );
}

function ConjugationRules() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid grid-cols-5 gap-px bg-zinc-800 text-center">
        {ROWS.map((row) => {
          const example = CONJUGATION_RULE_EXAMPLES[row.key];

          return (
            <Tooltip key={row.key}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="bg-black px-2 py-3 text-center outline-none focus-visible:bg-zinc-950"
                >
                  <div className="text-2xl">{row.kana}</div>
                  <div className="mt-1 text-sm text-zinc-400">{row.label}</div>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-base font-medium">{example.japanese}</div>
                <div className="mt-1 text-sm text-zinc-400">
                  {example.english}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-x-7 gap-y-3 text-base">
        {NON_GODAN_RULES.map((rule) => (
          <RuleTooltip key={rule.label} {...rule} />
        ))}
      </div>
    </div>
  );
}

function PairRules() {
  return (
    <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-3 text-base">
      {TRANSITIVITY_RULES.map((rule) => (
        <RuleTooltip key={rule.label} {...rule} />
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
  const [lastConjugationReview, setLastConjugationReview] =
    useState<ConjugationReview | null>(null);
  const [lastPairReview, setLastPairReview] = useState<PairReview | null>(null);
  const [reviewingPrevious, setReviewingPrevious] = useState(false);
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
    setReviewingPrevious(false);
    setLocked(false);

    if (nextMode === "conjugation" && difficulty === "guided") {
      setRulesOpen(false);
    }
  };

  const changeDifficulty = (nextDifficulty: Difficulty) => {
    clearPending();
    setDifficulty(nextDifficulty);
    setFeedback(null);
    setReviewingPrevious(false);
    setLocked(false);
    setConjugationQuestion((current) =>
      makeConjugationQuestion(current, nextDifficulty),
    );

    if (nextDifficulty === "guided" && mode === "conjugation") {
      setRulesOpen(false);
    }
  };

  const finishAnswer = useCallback(
    ({
      wasCorrect,
      answer,
      reading,
      detail,
      selected,
      next,
    }: {
      wasCorrect: boolean;
      answer: string;
      reading?: string;
      detail?: string;
      selected: string;
      next: () => void;
    }) => {
      if (locked) return;

      setLocked(true);
      setFeedback({
        correct: wasCorrect,
        answer,
        reading,
        detail,
        selected,
      });

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

  const activeReview =
    mode === "conjugation" ? lastConjugationReview : lastPairReview;
  const displayDifficulty =
    reviewingPrevious && activeReview ? activeReview.difficulty : difficulty;
  const displayFeedback =
    reviewingPrevious && activeReview ? activeReview.feedback : feedback;
  const displayLocked = reviewingPrevious ? true : locked;

  const displayConjugationQuestion =
    reviewingPrevious && mode === "conjugation" && lastConjugationReview
      ? lastConjugationReview.question
      : conjugationQuestion;
  const displayPairQuestion =
    reviewingPrevious && mode === "pairs" && lastPairReview
      ? lastPairReview.question
      : pairQuestion;

  const conjugationOptions = useMemo(() => {
    const { verb } = displayConjugationQuestion;

    const options: ConjugationOption[] = isGodanVerb(verb)
      ? ROWS.filter((row) => row.key !== "u").map((row) => ({
          row: row.key,
          rowKana: rowKana(verb, row.key),
          ending: rowEnding(verb, row.key),
          rowLabel: row.kana,
          meaningLabel: row.label,
        }))
      : targetKeys.map((target) => ({
          row: TARGETS[target].row,
          rowKana: conjugationChoice(verb, target),
          ending: conjugationChoice(verb, target),
          rowLabel: TARGETS[target].row,
          meaningLabel: TARGETS[target].label,
        }));

    return displayDifficulty === "recall" ? shuffle(options) : options;
  }, [displayConjugationQuestion, displayDifficulty]);

  const pairOptions = useMemo(() => {
    const { pair } = displayPairQuestion;
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
  }, [displayPairQuestion]);

  const answerConjugation = useCallback(
    (row: RowKey) => {
      const { verb, target } = conjugationQuestion;
      const expected = TARGETS[target].row;
      const wasCorrect = row === expected;

      const answer = conjugateVerb(verb, target);
      const reading = conjugateReading(verb, target);
      const detail = conjugationDetail(verb, target);
      const answerFeedback: Feedback = {
        correct: wasCorrect,
        answer,
        reading,
        detail,
        selected: row,
      };

      setLastConjugationReview({
        question: conjugationQuestion,
        difficulty,
        feedback: answerFeedback,
      });

      finishAnswer({
        wasCorrect,
        answer,
        reading,
        detail,
        selected: row,
        next: () =>
          setConjugationQuestion((current) =>
            makeConjugationQuestion(current, difficulty),
          ),
      });
    },
    [conjugationQuestion, difficulty, finishAnswer],
  );

  const answerPair = useCallback(
    (direction: Direction) => {
      const { pair, target } = pairQuestion;
      const wasCorrect = direction === target;
      const answer = target === "self" ? pair.self : pair.other;
      const reading =
        target === "self" ? pair.selfReading : pair.otherReading;

      const detail = PAIR_RULE_LABELS[pair.rule];
      const answerFeedback: Feedback = {
        correct: wasCorrect,
        answer,
        reading,
        detail,
        selected: direction,
      };

      setLastPairReview({
        question: pairQuestion,
        difficulty,
        feedback: answerFeedback,
      });

      finishAnswer({
        wasCorrect,
        answer,
        reading,
        detail,
        selected: direction,
        next: () => setPairQuestion((current) => makePairQuestion(current)),
      });
    },
    [difficulty, finishAnswer, pairQuestion],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key.toLowerCase() === "r") {
        setRulesOpen((value) => !value);
        return;
      }

      if (reviewingPrevious) return;

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
    reviewingPrevious,
  ]);

  const attempts = correct + wrong;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-zinc-800">
          <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-2 px-5 lg:px-8">
            <Button
              className={cn(
                "h-16 rounded-none border-b-2 px-4 text-lg",
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
                "h-16 rounded-none border-b-2 px-4 text-lg",
                mode === "pairs"
                  ? "border-white text-white"
                  : "border-transparent",
              )}
              variant="ghost"
              onClick={() => changeMode("pairs")}
            >
              Transitivity
            </Button>

            <div className="ml-auto flex items-center gap-3">
              <Button
                className="h-10 px-3 text-sm"
                size="sm"
                variant="ghost"
                disabled={!reviewingPrevious && (!activeReview || locked)}
                onClick={() => setReviewingPrevious((value) => !value)}
              >
                {reviewingPrevious ? "Current" : "Back"}
              </Button>

              <span className="hidden text-sm tabular-nums text-zinc-500 sm:inline">
                {attempts === 0 ? "0/0" : `${correct}/${attempts}`}
              </span>

              <label className="sr-only" htmlFor="difficulty">
                Difficulty
              </label>
              <select
                id="difficulty"
                className="h-10 rounded-sm border border-zinc-700 bg-black px-3 text-sm text-white outline-none focus:border-white"
                value={difficulty}
                onChange={(event) =>
                  changeDifficulty(event.target.value as Difficulty)
                }
              >
                <option value="guided">Guided</option>
                <option value="practice">Practice</option>
                <option value="recall">Recall</option>
              </select>

              <div className="flex items-center gap-2">
                <label
                  className="whitespace-nowrap text-sm tabular-nums text-zinc-400"
                  htmlFor="answer-delay"
                >
                  {(answerDelay / 1000).toFixed(2)}s
                </label>
                <input
                  id="answer-delay"
                  aria-label="Delay between questions"
                  title="Delay between questions"
                  type="range"
                  min="300"
                  max="3000"
                  step="50"
                  value={answerDelay}
                  onChange={(event) =>
                    setAnswerDelay(Number(event.target.value))
                  }
                  className="h-2 w-32 cursor-pointer accent-white"
                />
              </div>

              <Button
                aria-expanded={rulesOpen}
                className="h-10 px-3 text-sm"
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
            className="border-b border-zinc-800 px-6 py-5"
            aria-label="Rules"
          >
            {mode === "conjugation" ? <ConjugationRules /> : <PairRules />}
          </section>
        )}

        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-10 lg:px-8 lg:py-14">
          {mode === "conjugation" ? (
            <section className="text-center" aria-live="polite">
              <div className="text-[clamp(1.5rem,2.3vw,2.25rem)] font-medium">
                {TARGETS[displayConjugationQuestion.target].label}
              </div>
              <div className="mt-6 text-[clamp(4rem,8vw,7.5rem)] font-semibold leading-none tracking-tight">
                {displayConjugationQuestion.verb.word}
              </div>
              <div className="mt-5 text-[clamp(1.15rem,2vw,1.6rem)] text-zinc-400">
                {displayConjugationQuestion.verb.meaning}
              </div>

              <div className="mt-12 grid grid-cols-4 gap-4">
                {conjugationOptions.map((option, index) => (
                  <Button
                    key={option.row}
                    className={cn(
                      "h-32 min-w-0 flex-col gap-2 px-2 lg:h-36",
                      displayLocked &&
                        displayFeedback &&
                        !displayFeedback.correct &&
                        displayFeedback.selected === option.row &&
                        "border-red-500 bg-red-950/20 text-red-400 disabled:opacity-100",
                    )}
                    disabled={displayLocked}
                    variant="outline"
                    onClick={() => answerConjugation(option.row)}
                    aria-label={`Answer ${index + 1}: ${option.ending}`}
                  >
                    {displayDifficulty === "guided" && (
                      <span className="text-sm font-normal text-zinc-500 lg:text-base">
                        {option.rowLabel} · {option.meaningLabel}
                      </span>
                    )}
                    <span className="text-[clamp(2rem,4vw,3.5rem)] font-normal leading-none">
                      {displayDifficulty === "guided"
                        ? option.ending
                        : option.rowKana}
                    </span>
                    <span className="text-xs font-normal text-zinc-600">
                      {index + 1}
                    </span>
                  </Button>
                ))}
              </div>
            </section>
          ) : (
            <section className="text-center" aria-live="polite">
              <div className="text-[clamp(1.4rem,2.2vw,2rem)] font-medium">
                {displayPairQuestion.target === "self"
                  ? displayPairQuestion.pair.selfGloss
                  : displayPairQuestion.pair.otherGloss}
                {displayDifficulty === "guided" && (
                  <span className="text-zinc-500">
                    {" "}
                    · {displayPairQuestion.target.toUpperCase()}
                  </span>
                )}
              </div>

              <div className="mt-7 text-[clamp(4rem,8vw,7rem)] font-semibold leading-none tracking-tight">
                {displayDifficulty === "recall" ? `${displayPairQuestion.pair.stem}＿` : "?"}
              </div>

              {difficulty === "guided" && (
                <div className="mt-5 text-lg text-zinc-500">
                  {PAIR_RULE_LABELS[displayPairQuestion.pair.rule]}
                </div>
              )}

              <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-5">
                {pairOptions.map((option, index) => (
                  <Button
                    key={option.direction}
                    className={cn(
                      "flex-col gap-3 px-5",
                      displayLocked ? "h-44" : "h-36",
                      displayLocked &&
                        displayFeedback &&
                        !displayFeedback.correct &&
                        displayFeedback.selected === option.direction &&
                        "border-red-500 bg-red-950/20 text-red-400 disabled:opacity-100",
                    )}
                    disabled={displayLocked}
                    variant="outline"
                    onClick={() => answerPair(option.direction)}
                  >
                    <span className="text-[clamp(2.25rem,4vw,3.5rem)] font-normal leading-none">
                      {displayDifficulty === "recall"
                        ? `〜${option.ending}`
                        : option.word}
                    </span>
                    {displayLocked && (
                      <span className="max-w-full whitespace-normal text-center text-lg font-normal leading-snug text-zinc-400">
                        {option.gloss}
                      </span>
                    )}
                    <span className="text-xs font-normal text-zinc-600">
                      {index + 1}
                    </span>
                  </Button>
                ))}
              </div>
            </section>
          )}

          <div
            className="mt-10 min-h-32 text-center"
            aria-live="assertive"
          >
            {displayFeedback && (
              <div
                className={
                  displayFeedback.correct ? "text-white" : "text-red-400"
                }
              >
                <div className="text-[clamp(2rem,4vw,3.5rem)] font-normal leading-tight">
                  <span className="mr-3">{displayFeedback.correct ? "✓" : "✕"}</span>
                  {displayFeedback.reading ? (
                    <ruby>
                      {displayFeedback.answer}
                      <rt className="text-[0.38em] text-zinc-400">
                        {displayFeedback.reading}
                      </rt>
                    </ruby>
                  ) : (
                    displayFeedback.answer
                  )}
                </div>
                {displayFeedback.detail && (
                  <div
                    className={cn(
                      "mt-4 text-lg",
                      displayFeedback.correct ? "text-zinc-400" : "text-red-300",
                    )}
                  >
                    {displayFeedback.detail}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
