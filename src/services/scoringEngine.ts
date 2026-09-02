/**
 * AHAR X — Scoring Engine
 * 
 * Calculates the AHAR Score (0-100) based on transparent, rule-based criteria.
 * 
 * The score is broken down into four categories:
 *   - Nutrition (30 points)
 *   - Ingredients (25 points)
 *   - Claims (20 points)
 *   - Personal Goal (25 points)
 * 
 * Each category uses clear rules. The formula can be easily modified.
 * No unexplained AI-generated scores — every point is traceable.
 */

import type {
  AharScore,
  IngredientCategoryResult,
  NutritionStatus,
  PersonalizationResult,
  ScoreBreakdown,
} from "@/types/food";

/**
 * Calculate the AHAR Score from all analysis components.
 */
export function calculateAharScore(
  nutritionStatuses: NutritionStatus[],
  ingredientCategories: IngredientCategoryResult[],
  claimSupportedCount: number,
  claimTotalCount: number,
  personalization: PersonalizationResult,
): AharScore {
  const nutrition = calculateNutritionScore(nutritionStatuses);
  const ingredients = calculateIngredientsScore(ingredientCategories);
  const claims = calculateClaimsScore(claimSupportedCount, claimTotalCount);
  const personalGoal = calculatePersonalGoalScore(personalization);

  const total = nutrition.score + ingredients.score + claims.score + personalGoal.score;

  let overallStatus: "good" | "moderate" | "attention";
  if (total >= 75) overallStatus = "good";
  else if (total >= 50) overallStatus = "moderate";
  else overallStatus = "attention";

  return {
    total,
    breakdown: { nutrition, ingredients, claims, personalGoal },
    overallStatus,
  };
}

/**
 * Nutrition score: 0-30 points
 * Based on how many nutrients are in "good" vs "high" range.
 */
function calculateNutritionScore(
  statuses: NutritionStatus[],
): ScoreBreakdown["nutrition"] {
  const max = 30;
  if (statuses.length === 0) return { score: 0, max, status: "poor" };

  let goodCount = 0;
  let attentionCount = 0;

  for (const s of statuses) {
    if (s.status === "good") goodCount++;
    else if (s.status === "attention") attentionCount++;
  }

  // Points: good = full share, attention = half share
  const perNutrient = max / statuses.length;
  const score = Math.round(
    goodCount * perNutrient + attentionCount * perNutrient * 0.5,
  );

  let status: "good" | "attention" | "poor";
  if (score >= max * 0.7) status = "good";
  else if (score >= max * 0.4) status = "attention";
  else status = "poor";

  return { score: Math.min(score, max), max, status };
}

/**
 * Ingredients score: 0-25 points
 * Deductions for presence of added sugar, oils, preservatives, additives, allergens.
 */
function calculateIngredientsScore(
  categories: IngredientCategoryResult[],
): ScoreBreakdown["ingredients"] {
  const max = 25;
  let deductions = 0;

  for (const cat of categories) {
    if (cat.status === "none") continue;
    switch (cat.category) {
      case "added_sugar":
        deductions += 6;
        break;
      case "oils_fats":
        deductions += 3;
        break;
      case "preservatives":
        deductions += 4;
        break;
      case "additives":
        deductions += 4;
        break;
      case "allergens":
        deductions += 2;
        break;
      default:
        deductions += 1;
    }
  }

  const score = Math.max(0, max - deductions);

  let status: "good" | "attention" | "poor";
  if (score >= max * 0.7) status = "good";
  else if (score >= max * 0.4) status = "attention";
  else status = "poor";

  return { score, max, status };
}

/**
 * Claims score: 0-20 points
 * Based on how many claims are supported vs total.
 */
function calculateClaimsScore(
  supportedCount: number,
  totalCount: number,
): ScoreBreakdown["claims"] {
  const max = 20;
  if (totalCount === 0) return { score: max, max, status: "good" };

  const ratio = supportedCount / totalCount;
  const score = Math.round(max * ratio);

  let status: "good" | "attention" | "poor";
  if (ratio >= 0.8) status = "good";
  else if (ratio >= 0.4) status = "attention";
  else status = "poor";

  return { score, max, status };
}

/**
 * Personal goal score: 0-25 points
 * Based on how well the food matches the user's selected goal.
 */
function calculatePersonalGoalScore(
  personalization: PersonalizationResult,
): ScoreBreakdown["personalGoal"] {
  const max = 25;

  let score: number;
  let status: "good" | "attention" | "poor";

  switch (personalization.status) {
    case "ideal":
      score = max;
      status = "good";
      break;
    case "moderate":
      score = Math.round(max * 0.6);
      status = "attention";
      break;
    case "not_ideal":
      score = Math.round(max * 0.3);
      status = "poor";
      break;
  }

  return { score, max, status };
}
