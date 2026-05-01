import type { PsychTest } from "@/features/test-core/domain/model/psychTest";

// 미리보기 전용 — 문항이 비어 있어 시작 버튼은 비활성 처리됨.
// 실제 문항 데이터가 추가되면 questions 배열만 채우면 활성화됨.
export const EMPATHY_TEST: PsychTest = {
  id: "empathy",
  contentId: "empathy_test",
  title: "당신은 어떤 공감을 하나요?",
  description: "감성적 공감 vs 인지적 공감",
  estimatedMinutes: 3,
  questions: [],
  resultImageDir: "/images/playful/empathy",
  thumbnailPath: "/images/mbti/feel_logic.png",
};
