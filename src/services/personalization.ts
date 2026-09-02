/**
 * AHAR X — Personalization Service
 * 
 * Compares food analysis results with the user's selected health goal
 * to provide personalized recommendations.
 * 
 * IMPORTANT: This service does NOT provide medical advice or diagnose diseases.
 * All recommendations are general informational guidance only.
 */

import type {
  GoalType,
  NutritionData,
  PersonalizationResult,
  PersonalizationStatus,
} from "@/types/food";
import { GOAL_LABELS } from "@/types/food";

/**
 * Goal-specific evaluation rules.
 * Each goal has primary nutrients to watch and their thresholds.
 */
interface GoalRule {
  primary: string[];
  watch: string[];
  thresholds: Record<string, { good: number; bad: number }>;
}

const GOAL_RULES: Record<GoalType, GoalRule> = {
  weight_management: {
    primary: ["energy"],
    watch: ["sugar", "totalFat"],
    thresholds: {
      energy: { good: 200, bad: 400 },
      sugar: { good: 8, bad: 18 },
      totalFat: { good: 8, bad: 18 },
    },
  },
  muscle_gain: {
    primary: ["protein"],
    watch: ["sugar", "saturatedFat"],
    thresholds: {
      protein: { good: 15, bad: 5 },
      sugar: { good: 10, bad: 20 },
      saturatedFat: { good: 3, bad: 8 },
    },
  },
  general_healthy: {
    primary: ["protein"],
    watch: ["sugar", "sodium", "totalFat"],
    thresholds: {
      protein: { good: 8, bad: 3 },
      sugar: { good: 8, bad: 18 },
      sodium: { good: 200, bad: 500 },
      totalFat: { good: 10, bad: 20 },
    },
  },
  low_sugar: {
    primary: ["sugar"],
    watch: ["carbohydrates"],
    thresholds: {
      sugar: { good: 5, bad: 12 },
      carbohydrates: { good: 30, bad: 55 },
    },
  },
  low_sodium: {
    primary: ["sodium"],
    watch: ["energy"],
    thresholds: {
      sodium: { good: 120, bad: 400 },
      energy: { good: 200, bad: 400 },
    },
  },
};

/**
 * Evaluate a food product against a user's selected goal.
 */
export function personalizeAnalysis(
  goal: GoalType,
  nutrition: NutritionData,
): PersonalizationResult {
  const rule = GOAL_RULES[goal];
  let positiveCount = 0;
  let negativeCount = 0;
  let totalChecks = 0;

  // Check primary nutrients
  for (const nutrient of rule.primary) {
    const value = nutrition[nutrient as keyof NutritionData];
    const threshold = rule.thresholds[nutrient];
    if (value === undefined || !threshold) continue;
    totalChecks++;
    if (nutrient === "protein") {
      // Higher is better for protein
      if (value >= threshold.good) positiveCount++;
      else if (value < threshold.bad) negativeCount++;
    } else {
      // Lower is better for most nutrients
      if (value <= threshold.good) positiveCount++;
      else if (value > threshold.bad) negativeCount++;
    }
  }

  // Check watched nutrients
  for (const nutrient of rule.watch) {
    const value = nutrition[nutrient as keyof NutritionData];
    const threshold = rule.thresholds[nutrient];
    if (value === undefined || !threshold) continue;
    totalChecks++;
    if (value <= threshold.good) positiveCount++;
    else if (value > threshold.bad) negativeCount++;
  }

  let status: PersonalizationStatus;
  let summary: string;
  let explanation: string;

  if (negativeCount === 0 && positiveCount >= totalChecks * 0.5) {
    status = "ideal";
    summary = "This product aligns well with your goal.";
    explanation = generateExplanation(goal, nutrition, "ideal");
  } else if (negativeCount >= 2) {
    status = "not_ideal";
    summary = `This product may not align well with your selected ${GOAL_LABELS[goal].toLowerCase()} goal.`;
    explanation = generateExplanation(goal, nutrition, "not_ideal");
  } else {
    status = "moderate";
    summary = `This product has mixed alignment with your ${GOAL_LABELS[goal].toLowerCase()} goal.`;
    explanation = generateExplanation(goal, nutrition, "moderate");
  }

  return {
    goal,
    goalLabel: GOAL_LABELS[goal],
    status,
    summary,
    explanation,
  };
}

/**
 * Generate a detailed explanation based on goal and status.
 */
function generateExplanation(
  goal: GoalType,
  nutrition: NutritionData,
  status: PersonalizationStatus,
): string {
  const goalLabel = GOAL_LABELS[goal];

  switch (goal) {
    case "low_sugar":
      if (status === "ideal")
        return `This product has low sugar (${nutrition.sugar}g), which is great for your low-sugar goal.`;
      if (status === "not_ideal")
        return `This product contains ${nutrition.sugar}g of sugar, which is relatively high for a low-sugar goal. Consider lower-sugar alternatives for frequent consumption.`;
      return `This product has ${nutrition.sugar}g of sugar. It may be acceptable occasionally but check your daily intake.`;

    case "low_sodium":
      if (status === "ideal")
        return `This product has low sodium (${nutrition.sodium}mg), well-suited for your low-sodium goal.`;
      if (status === "not_ideal")
        return `This product contains ${nutrition.sodium}mg of sodium, which is high for a low-sodium goal. Consider reducing frequency or choosing lower-sodium options.`;
      return `This product has ${nutrition.sodium}mg of sodium. Moderate for a low-sodium goal.`;

    case "muscle_gain":
      if (status === "ideal")
        return `Good protein content (${nutrition.protein}g) supports your muscle gain goal. The overall nutrition profile is supportive.`;
      if (status === "not_ideal")
        return `Protein content (${nutrition.protein}g) may be insufficient for muscle gain. Consider higher-protein alternatives.`;
      return `Protein content (${nutrition.protein}g) is moderate. Consider pairing with additional protein sources.`;

    case "weight_management":
      if (status === "ideal")
        return `This product has reasonable energy (${nutrition.energy}kcal) for a weight management goal.`;
      if (status === "not_ideal")
        return `At ${nutrition.energy}kcal per serving with ${nutrition.sugar}g sugar and ${nutrition.totalFat}g fat, this product may not be ideal for weight management. Consider lower-calorie alternatives.`;
      return `Energy content (${nutrition.energy}kcal) is moderate. Be mindful of portion sizes for weight management.`;

    case "general_healthy":
      if (status === "ideal")
        return `This product has a balanced nutrition profile suitable for general healthy eating.`;
      if (status === "not_ideal")
        return `Some nutritional aspects may not align with general healthy eating guidelines. Consider moderation.`;
      return `This product has mixed nutritional qualities. Consume in moderation as part of a balanced diet.`;

    default:
      return `Analysis for ${goalLabel}: consume according to your dietary needs.`;
  }
}
