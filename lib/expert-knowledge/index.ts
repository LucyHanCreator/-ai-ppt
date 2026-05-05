import { beautyKnowledge } from "@/lib/expert-knowledge/beauty";
import { personalIpKnowledge } from "@/lib/expert-knowledge/personal-ip";
import { shortVideoKnowledge } from "@/lib/expert-knowledge/short-video";
import { yogaFitnessKnowledge } from "@/lib/expert-knowledge/yoga-fitness";

export type IndustryConfidence = "high" | "medium" | "low";

export type ExpertKnowledge = {
  courseIndustry: string;
  industryName: string;
  expertRole: string;
  keywords: readonly string[];
  realBusinessProblems: readonly string[];
  rootCauses: readonly string[];
  hiddenNeeds: readonly string[];
  buyingMotivations: readonly string[];
  trustBarriers: readonly string[];
  keyStrategies: readonly string[];
  courseAngles: readonly string[];
  expertInsights: readonly string[];
  surfaceProblem: string;
  rootProblem: string;
  emotionalDrivers: readonly string[];
  moneyLogic: string;
  courseMechanism: string;
  transformationPath: readonly string[];
  proofAssets: readonly string[];
  conversionTrigger: string;
  mustAvoid: readonly string[];
  visualKeywords: readonly string[];
};

export const coreExpertKnowledge = [beautyKnowledge, yogaFitnessKnowledge, shortVideoKnowledge, personalIpKnowledge] satisfies ExpertKnowledge[];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function scoreKnowledge(input: string, knowledge: ExpertKnowledge) {
  return knowledge.keywords.reduce((score, keyword) => (input.includes(normalize(keyword)) ? score + 1 : score), 0);
}

export function matchExpertKnowledge(input: string) {
  const normalizedInput = normalize(input);
  const scored = coreExpertKnowledge
    .map((knowledge) => ({
      knowledge,
      score: scoreKnowledge(normalizedInput, knowledge)
    }))
    .sort((a, b) => b.score - a.score);
  const best = scored[0];

  if (!best || best.score === 0) {
    return null;
  }

  const confidence: IndustryConfidence = best.score >= 2 ? "high" : "medium";
  return {
    knowledge: best.knowledge,
    confidence
  };
}
