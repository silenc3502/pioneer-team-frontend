import type { PsychTest } from "@/features/test-core/domain/model/psychTest";
import { EMPATHY_TEST } from "@/features/playful-test/domain/data/tests/empathyTest";

export const PLAYFUL_TESTS: Record<string, PsychTest> = {
  [EMPATHY_TEST.id]: EMPATHY_TEST,
};

export const findPlayfulTest = (id: string): PsychTest | null =>
  PLAYFUL_TESTS[id] ?? null;
