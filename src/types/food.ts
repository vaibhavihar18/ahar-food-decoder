/**
 * AHAR X — Core Type Definitions
 * These types model the entire food analysis pipeline:
 * SCAN → DECODE → VERIFY → PERSONALIZE → EXPLAIN
 */

// ─── User Profile ───────────────────────────────────────────────

export type GoalType =
  | "weight_management"
  | "muscle_gain"
  | "general_healthy"
  | "low_sugar"
  | "low_sodium";

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  foodPreference: string;
  goal: GoalType;
  createdAt: number;
}

export const GOAL_LABELS: Record<GoalType, string> = {
  weight_management: "Weight Management",
  muscle_gain: "Muscle Gain",
  general_healthy: "General Healthy Eating",
  low_sugar: "Low Sugar",
  low_sodium: "Low Sodium",
};

export const GOAL_DESCRIPTIONS: Record<GoalType, string> = {
  weight_management:
    "Focus on balanced calories and nutrient-dense foods to support healthy weight management.",
  muscle_gain:
    "Prioritize high-protein foods with adequate energy to support muscle building and recovery.",
  general_healthy:
    "Choose foods with balanced nutrition, minimal additives, and wholesome ingredients.",
  low_sugar:
    "Minimize added sugars and choose foods with naturally low sugar content.",
  low_sodium:
    "Limit sodium intake to support healthy blood pressure and heart health.",
};

// ─── Nutrition Data ─────────────────────────────────────────────

export interface NutritionData {
  energy: number; // kcal
  protein: number; // g
  carbohydrates: number; // g
  sugar: number; // g
  totalFat: number; // g
  saturatedFat: number; // g
  sodium: number; // mg
}

export interface NutritionStatus {
  key: keyof NutritionData;
  label: string;
  value: number;
  unit: string;
  status: "good" | "attention" | "high";
  explanation: string;
}

// ─── Ingredients ────────────────────────────────────────────────

export type IngredientCategory =
  | "added_sugar"
  | "oils_fats"
  | "preservatives"
  | "additives"
  | "allergens"
  | "other";

export interface ParsedIngredient {
  name: string;
  category: IngredientCategory;
}

export interface IngredientCategoryResult {
  category: IngredientCategory;
  label: string;
  status: "present" | "warning" | "none";
  items: string[];
  explanation: string;
}

// ─── Claims ─────────────────────────────────────────────────────

export type ClaimStatus =
  | "supported"
  | "attention"
  | "not_supported"
  | "unable_to_verify";

export interface FoodClaim {
  text: string;
  nutrient: string;
}

export interface ClaimVerification {
  claim: string;
  status: ClaimStatus;
  declaredValue: string;
  reason: string;
  ruleSource: string;
}

// ─── FSSAI Rule Engine ──────────────────────────────────────────

export interface FSSAIRule {
  claim: string;
  nutrient: string;
  rule_status: "verified" | "requires_verified_rule";
  source: string;
  description: string;
}

// ─── Personalization ────────────────────────────────────────────

export type PersonalizationStatus = "ideal" | "moderate" | "not_ideal";

export interface PersonalizationResult {
  goal: GoalType;
  goalLabel: string;
  status: PersonalizationStatus;
  summary: string;
  explanation: string;
}

// ─── AHAR Score ─────────────────────────────────────────────────

export interface ScoreBreakdown {
  nutrition: { score: number; max: number; status: "good" | "attention" | "poor" };
  ingredients: { score: number; max: number; status: "good" | "attention" | "poor" };
  claims: { score: number; max: number; status: "good" | "attention" | "poor" };
  personalGoal: { score: number; max: number; status: "good" | "attention" | "poor" };
}

export interface AharScore {
  total: number; // 0-100
  breakdown: ScoreBreakdown;
  overallStatus: "good" | "moderate" | "attention";
}

// ─── Food Product / Analysis ────────────────────────────────────

export interface FoodProduct {
  id: string;
  name: string;
  imageUrl: string;
  nutrition: NutritionData;
  ingredients: string[];
  claims: FoodClaim[];
  isDemo: boolean;
}

export type AnalysisStep =
  | "scanning"
  | "reading_label"
  | "understanding_ingredients"
  | "verifying_claims"
  | "personalizing"
  | "generating_insight";

export interface FoodAnalysis {
  id: string;
  product: FoodProduct;
  nutritionStatuses: NutritionStatus[];
  ingredientCategories: IngredientCategoryResult[];
  claimVerifications: ClaimVerification[];
  personalization: PersonalizationResult;
  aharScore: AharScore;
  finalInsight: string;
  recommendation: string;
  timestamp: number;
}

// ─── History Entry ──────────────────────────────────────────────

export interface HistoryEntry {
  id: string;
  productName: string;
  aharScore: number;
  overallStatus: "good" | "moderate" | "attention";
  timestamp: number;
  analysis: FoodAnalysis;
}
