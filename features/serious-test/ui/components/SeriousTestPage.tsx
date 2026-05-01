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
import { SeriousHeroImage } from "@/features/serious-test/ui/components/SeriousHeroImage";
import { SeriousStartButton } from "@/features/serious-test/ui/components/SeriousStartButton";
import { SeriousResultSection } from "@/features/serious-test/ui/components/SeriousResultSection";

const CityScene = dynamic(
  () =>
    import("@/features/serious-test/ui/components/CityScene").then((m) => ({
      default: m.CityScene,
    })),
  { ssr: false },
);

const DEFAULT_HERO_IMAGE_SRC = "/images/ceo/ceo_type.png";
const HERO_IMAGE_ALT = "심리 테스트 메인 이미지";

type Props = {
  test: PsychTest;
};

export const SeriousTestPage = ({ test }: Props) => {
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
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#0F172A] text-zinc-100">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <CityScene />
      </div>

      <header className="relative mx-auto mt-3 flex w-full max-w-5xl shrink-0 items-center justify-between px-6 py-3 sm:px-10">
        <BrandLogo />
        <span className="rounded-md bg-zinc-800/80 px-3 py-1 text-xs font-bold text-zinc-200 ring-1 ring-zinc-700">
          진지한 자기 탐색
        </span>
      </header>

      <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 pb-6 sm:px-10">
        {isCompleted ? (
          <SeriousResultSection
            testContentId={test.contentId}
            testTitle={test.title}
            resultImageDir={test.resultImageDir}
          />
        ) : isAnswering && currentQuestion ? (
          <div className="flex w-full max-w-xl flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              {currentQuestion.category && (
                <span className="rounded-md bg-zinc-800 px-4 py-1.5 text-xs font-bold text-zinc-100 ring-1 ring-zinc-700">
                  {currentQuestion.category}
                </span>
              )}
              <span className="text-xs font-bold text-zinc-400">
                {currentIndex + 1} / {totalQuestionCount}
              </span>
            </div>
            <div className="w-full rounded-2xl bg-white/95 p-6 shadow-2xl ring-1 ring-zinc-200 backdrop-blur-sm">
              <QuestionTemplate
                question={currentQuestion}
                onSelect={handleSelectChoice}
              />
            </div>
          </div>
        ) : (
          <ImpressionTracker contentId={heroContentId(test.contentId)}>
            <SeriousHeroImage
              src={test.thumbnailPath ?? DEFAULT_HERO_IMAGE_SRC}
              alt={HERO_IMAGE_ALT}
            >
              <SeriousStartButton onStart={handleStartClick} />
            </SeriousHeroImage>
          </ImpressionTracker>
        )}
      </main>
    </div>
  );
};
