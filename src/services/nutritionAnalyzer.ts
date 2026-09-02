/**
 * AHAR X — Nutrition Analysis Service
 * 
 * Evaluates nutrition data against rule-based thresholds.
 * These thresholds are prototype defaults and should be replaced
 * with verified regulatory values for production.
 */

import type { NutritionData, NutritionStatus } from "@/types/food";

/**
 * Prototype nutrition thresholds per 100g serving.
 * These are simplified for demonstration purposes.
 */
const THRESHOLDS = {
  sugar: { good: 5, attention: 15 }, // g
  protein: { good: 10, attention: 5 }, // g (higher is better)
  totalFat: { good: 3, attention: 17 }, // g
  saturatedFat: { good: 1.5, attention: 5 }, // g
  sodium: { good: 120, attention: 500 }, // mg
  energy: { good: 150, attention: 400 }, // kcal
  carbohydrates: { good: 30, attention: 55 }, // g
};

function evaluate(
  value: number,
  goodThreshold: number,
  attentionThreshold: number,
  lowerIsBetter: boolean,
): "good" | "attention" | "high" {
  if (lowerIsBetter) {
    if (value <= goodThreshold) return "good";
    if (value <= attentionThreshold) return "attention";
    return "high";
  }
  // For protein — higher is better
  if (value >= goodThreshold) return "good";
  if (value >= attentionThreshold) return "attention";
  return "high";
}

function getStatusLabel(status: "good" | "attention" | "high"): string {
  if (status === "good") return "Good";
  if (status === "attention") return "Moderate";
  return "High";
}

/**
 * Analyze nutrition data and return per-nutrient status objects.
 */
export function analyzeNutrition(nutrition: NutritionData): NutritionStatus[] {
  const items: NutritionStatus[] = [
    {
      key: "energy",
      label: "Energy",
      value: nutrition.energy,
      unit: "kcal",
      status: evaluate(
        nutrition.energy,
        THRESHOLDS.energy.good,
        THRESHOLDS.energy.attention,
        true,
      ),
      explanation: `${nutrition.energy} kcal of energy is present per serving.`,
    },
    {
      key: "protein",
      label: "Protein",
      value: nutrition.protein,
      unit: "g",
      status: evaluate(
        nutrition.protein,
        THRESHOLDS.protein.good,
        THRESHOLDS.protein.attention,
        false,
      ),
      explanation: `${nutrition.protein} g of protein is present per serving. ${getStatusLabel(
        evaluate(
          nutrition.protein,
          THRESHOLDS.protein.good,
          THRESHOLDS.protein.attention,
          false,
        ),
      )} amount.`,
    },
    {
      key: "carbohydrates",
      label: "Carbohydrates",
      value: nutrition.carbohydrates,
      unit: "g",
      status: evaluate(
        nutrition.carbohydrates,
        THRESHOLDS.carbohydrates.good,
        THRESHOLDS.carbohydrates.attention,
        true,
      ),
      explanation: `${nutrition.carbohydrates} g of carbohydrates per serving.`,
    },
    {
      key: "sugar",
      label: "Sugar",
      value: nutrition.sugar,
      unit: "g",
      status: evaluate(
        nutrition.sugar,
        THRESHOLDS.sugar.good,
        THRESHOLDS.sugar.attention,
        true,
      ),
      explanation: `${nutrition.sugar} g of sugar is present per serving. ${getStatusLabel(
        evaluate(
          nutrition.sugar,
          THRESHOLDS.sugar.good,
          THRESHOLDS.sugar.attention,
          true,
        ),
      )} amount.`,
    },
    {
      key: "totalFat",
      label: "Total Fat",
      value: nutrition.totalFat,
      unit: "g",
      status: evaluate(
        nutrition.totalFat,
        THRESHOLDS.totalFat.good,
        THRESHOLDS.totalFat.attention,
        true,
      ),
      explanation: `${nutrition.totalFat} g of total fat per serving.`,
    },
    {
      key: "saturatedFat",
      label: "Saturated Fat",
      value: nutrition.saturatedFat,
      unit: "g",
      status: evaluate(
        nutrition.saturatedFat,
        THRESHOLDS.saturatedFat.good,
        THRESHOLDS.saturatedFat.attention,
        true,
      ),
      explanation: `${nutrition.saturatedFat} g of saturated fat per serving.`,
    },
    {
      key: "sodium",
      label: "Sodium",
      value: nutrition.sodium,
      unit: "mg",
      status: evaluate(
        nutrition.sodium,
        THRESHOLDS.sodium.good,
        THRESHOLDS.sodium.attention,
        true,
      ),
      explanation: `${nutrition.sodium} mg of sodium per serving.`,
    },
  ];

  return items;
}
