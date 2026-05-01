"use client";

import dynamic from "next/dynamic";
import type { Choice } from "@/features/quiz/domain/model/question";
import { QuestionTemplate } from "@/features/quiz/ui/components/QuestionTemplate";
import { BrandLogo } from "@/ui/components/BrandLogo";
import type { PsychTest } from "@/features/test-core/domain/model/psychTest";
import { usePsychTestRunner } from "@/features/test-core/application/hooks/usePsychTestRunner";
import { useLandTracking } from "@/features/tracking/application/hooks/useLandTracking";
import { useTracking } from "@/features/tracking/application/hooks/useTracking";
import { ImpressionTracker } from "@/features/tracking/ui/components/ImpressionTracker";
import {
  heroContentId,
  startButtonContentId,
} from "@/features/tracking/domain/contentId";
import { PlayfulHeroImage } from "@/features/playful-test/ui/components/PlayfulHeroImage";
import { PlayfulStartButton } from "@/features/playful-test/ui/components/PlayfulStartButton";
import { PlayfulResultSection } from "@/features/playful-test/ui/components/PlayfulResultSection";

const AmusementParkScene = dynamic(
  () =>
    import(
      "@/features/playful-test/ui/components/AmusementParkScene"
    ).then((m) => ({ default: m.AmusementParkScene })),
  { ssr: false },
);

const FLAG_COLORS = [
  "bg-rose-400",
  "bg-amber-400",
  "bg-sky-400",
  "bg-lime-400",
];
const TRIANGLE_CLIP = "[clip-path:polygon(0_0,100%_0,50%_100%)]";
const STAR_CLIP =
  "[clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]";

const DEFAULT_HERO_IMAGE_SRC = "/images/mbti/feel_logic.png";
const HERO_IMAGE_ALT = "심리 테스트 메인 이미지";

type Props = {
  test: PsychTest;
};

export const PlayfulTestPage = ({ test }: Props) => {
  const {
    isReady,
    isAnswering,
    isCompleted,
    currentQuestion,
    currentIndex,
    totalQuestionCount,
    onStartTest,
    onSelectChoice,
  } = usePsychTestRunner(test);

  useLandTracking({ contentId: test.contentId });
  const { trackStart } = useTracking();

  const handleStartClick = () => {
    trackStart(startButtonContentId(test.contentId));
    onStartTest();
  };

  const handleSelectChoice = (choice: Choice) => {
    if (!currentQuestion) return;
    onSelectChoice(currentQuestion.id, choice.id);
  };

  if (!isReady && !isAnswering && !isCompleted) {
    return null;
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#FFF7F8]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-100 [background-image:radial-gradient(circle,#FFEFF2_1.5px,transparent_1.5px)] [background-size:26px_26px]"
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-32 h-64 w-64 rounded-full bg-rose-300/35 blur-3xl" />
        <div className="absolute -right-16 top-10 h-72 w-72 rounded-full bg-sky-300/35 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-lime-300/35 blur-3xl" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
      >
        <AmusementParkScene />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[42%]"
      >
        <div className="h-[60vh] w-[44vh] rounded-full bg-[#F5AAAF]/75 blur-3xl" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[42%]"
      >
        <div className="h-[42vh] w-[30vh] rounded-full bg-[#FCD8DA]/60 blur-2xl" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-2 h-px bg-zinc-400/30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-2 flex justify-around px-2"
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className={`h-4 w-4 ${FLAG_COLORS[i % FLAG_COLORS.length]} ${TRIANGLE_CLIP} shadow-sm`}
          />
        ))}
      </div>

      <div
        aria-hidden
        className={`pointer-events-none absolute left-8 top-28 h-5 w-5 bg-yellow-400 ${STAR_CLIP}`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute right-12 top-40 h-4 w-4 bg-rose-400 ${STAR_CLIP}`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute left-20 bottom-32 h-6 w-6 bg-sky-400 ${STAR_CLIP}`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute right-20 bottom-24 h-5 w-5 bg-lime-500 ${STAR_CLIP}`}
      />

      <header className="relative mx-auto mt-3 flex w-full max-w-5xl shrink-0 items-center justify-between px-6 py-3 sm:px-10">
        <BrandLogo />
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-zinc-700 shadow-sm ring-1 ring-zinc-100">
          오늘 뭐하고 놀까?
        </span>
      </header>

      <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 pb-6 sm:px-10">
        {isCompleted ? (
          <PlayfulResultSection
            testContentId={test.contentId}
            testTitle={test.title}
            resultImageDir={test.resultImageDir}
          />
        ) : isAnswering && currentQuestion ? (
          <div className="flex w-full max-w-xl flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              {currentQuestion.category && (
                <span className="rounded-full bg-orange-400 px-4 py-1.5 text-xs font-bold text-white shadow-sm ring-2 ring-orange-200">
                  {currentQuestion.category}
                </span>
              )}
              <span className="text-xs font-bold text-zinc-500">
                {currentIndex + 1} / {totalQuestionCount}
              </span>
            </div>
            <QuestionTemplate
              question={currentQuestion}
              onSelect={handleSelectChoice}
            />
          </div>
        ) : (
          <ImpressionTracker contentId={heroContentId(test.contentId)}>
            <PlayfulHeroImage
              src={test.thumbnailPath ?? DEFAULT_HERO_IMAGE_SRC}
              alt={HERO_IMAGE_ALT}
            >
              {test.questions.length > 0 ? (
                <PlayfulStartButton onStart={handleStartClick} />
              ) : (
                <div className="rounded-full bg-white/95 px-5 py-2.5 text-xs font-bold text-zinc-700 shadow-md ring-1 ring-zinc-200">
                  준비 중
                </div>
              )}
            </PlayfulHeroImage>
          </ImpressionTracker>
        )}
      </main>
    </div>
  );
};
