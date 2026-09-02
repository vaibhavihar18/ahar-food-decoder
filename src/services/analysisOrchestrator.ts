/**
 * AHAR X — Analysis Orchestrator
 * 
 * Coordinates the complete analysis pipeline:
 *   SCAN → DECODE → VERIFY → PERSONALIZE → EXPLAIN
 * 
 * This is the main service that ties all analysis steps together.
 */

import type {
  AnalysisStep,
  FoodAnalysis,
  FoodProduct,
  GoalType,
  HistoryEntry,
} from "@/types/food";
import { analyzeNutrition } from "./nutritionAnalyzer";
import { analyzeIngredients } from "./ingredientAnalyzer";
import { verifyAllClaims } from "./claimVerification";
import { personalizeAnalysis } from "./personalization";
import { calculateAharScore } from "./scoringEngine";
import { getStorage, saveToHistory } from "./storageService";

/**
 * Generate a unique ID for analysis results.
 */
function generateId(): string {
  return `analysis-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Run the full analysis pipeline on a food product for a given user goal.
 * Returns the complete FoodAnalysis object.
 */
export function runFullAnalysis(
  product: FoodProduct,
  goal: GoalType,
): FoodAnalysis {
  // Step 1: DECODE — Analyze nutrition
  const nutritionStatuses = analyzeNutrition(product.nutrition);

  // Step 2: DECODE — Analyze ingredients
  const ingredientCategories = analyzeIngredients(product.ingredients);

  // Step 3: VERIFY — Verify claims
  const claimVerifications = verifyAllClaims(
    product.claims,
    product.nutrition,
  );

  // Step 4: PERSONALIZE — Compare with user goal
  const personalization = personalizeAnalysis(goal, product.nutrition);

  // Calculate supported claims count for scoring
  const supportedClaims = claimVerifications.filter(
    (c) => c.status === "supported",
  ).length;

  // Step 5: SCORE — Calculate AHAR Score
  const aharScore = calculateAharScore(
    nutritionStatuses,
    ingredientCategories,
    supportedClaims,
    claimVerifications.length,
    personalization,
  );

  // Generate final insight and recommendation
  const { finalInsight, recommendation } = generateInsight(
    aharScore.overallStatus,
    nutritionStatuses,
    ingredientCategories,
    claimVerifications,
    personalization,
  );

  const analysis: FoodAnalysis = {
    id: generateId(),
    product,
    nutritionStatuses,
    ingredientCategories,
    claimVerifications,
    personalization,
    aharScore,
    finalInsight,
    recommendation,
    timestamp: Date.now(),
  };

  // Save to history
  const profile = getStorage().profile;
  if (profile) {
    saveToHistory({
      id: analysis.id,
      productName: product.name,
      aharScore: aharScore.total,
      overallStatus: aharScore.overallStatus,
      timestamp: analysis.timestamp,
      analysis,
    });
  }

  return analysis;
}

/**
 * Generate the final insight and recommendation based on all analysis components.
 */
function generateInsight(
  overallStatus: "good" | "moderate" | "attention",
  nutritionStatuses: ReturnType<typeof analyzeNutrition>,
  ingredientCategories: ReturnType<typeof analyzeIngredients>,
  claimVerifications: ReturnType<typeof verifyAllClaims>,
  personalization: ReturnType<typeof personalizeAnalysis>,
): { finalInsight: string; recommendation: string } {
  const concerns: string[] = [];
  const positives: string[] = [];

  // Check nutrition
  const highNutrients = nutritionStatuses.filter((n) => n.status === "high");
  if (highNutrients.length > 0) {
    concerns.push(
      `High ${highNutrients.map((n) => n.label.toLowerCase()).join(" and ")} levels`,
    );
  }

  const goodNutrients = nutritionStatuses.filter((n) => n.status === "good");
  if (goodNutrients.length > 0) {
    positives.push(
      `Good ${goodNutrients.map((n) => n.label.toLowerCase()).join(", ")}`,
    );
  }

  // Check ingredients
  const badIngredients = ingredientCategories.filter(
    (c) => c.status === "warning",
  );
  if (badIngredients.length > 0) {
    concerns.push(
      `${badIngredients.map((c) => c.label).join(", ")} detected`,
    );
  }

  // Check claims
  const attentionClaims = claimVerifications.filter(
    (c) => c.status === "attention" || c.status === "not_supported",
  );
  if (attentionClaims.length > 0) {
    concerns.push(
      `${attentionClaims.length} claim(s) need attention`,
    );
  }

  // Check personalization
  if (personalization.status === "not_ideal") {
    concerns.push(
      `Not ideal for your ${personalization.goalLabel.toLowerCase()} goal`,
    );
  } else if (personalization.status === "ideal") {
    positives.push(
      `Good match for your ${personalization.goalLabel.toLowerCase()} goal`,
    );
  }

  // Build insight
  let finalInsight: string;
  if (overallStatus === "good") {
    finalInsight = `This product generally looks good. ${positives.length > 0 ? positives.join(". ") + "." : "It meets most nutritional criteria."}`;
  } else if (overallStatus === "moderate") {
    finalInsight = `This product has mixed qualities. ${concerns.length > 0 ? concerns.join(". ") + "." : "Some aspects need attention."} ${positives.length > 0 ? positives.join(". ") + "." : ""}`;
  } else {
    finalInsight = `This product has several concerns. ${concerns.join(". ")}. Consider moderation or healthier alternatives.`;
  }

  // Build recommendation
  let recommendation: string;
  if (overallStatus === "good") {
    recommendation =
      "This product is a reasonable choice within a balanced diet. No major concerns detected.";
  } else if (overallStatus === "moderate") {
    recommendation =
      "Consider consuming this product occasionally. Be mindful of the areas flagged for attention, especially if they conflict with your health goals.";
  } else {
    recommendation =
      "Consider alternatives with better nutritional profiles for frequent consumption. This product may not align well with your health goals.";
  }

  return { finalInsight, recommendation };
}

/**
 * Get all analysis steps for the scanning animation.
 */
export const ANALYSIS_STEPS: { key: AnalysisStep; label: string }[] = [
  { key: "scanning", label: "Scanning Image" },
  { key: "reading_label", label: "Reading Nutrition Label" },
  { key: "understanding_ingredients", label: "Understanding Ingredients" },
  { key: "verifying_claims", label: "Verifying Claims" },
  { key: "personalizing", label: "Personalizing Results" },
  { key: "generating_insight", label: "Generating Food Insight" },
];
