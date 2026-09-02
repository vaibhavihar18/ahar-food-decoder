/**
 * AHAR X — Claim Verification Service
 * 
 * Verifies food label claims against the FSSAI rule engine.
 * 
 * Pipeline: Claim → Nutrition Data → Applicable Rule → Verification → Result
 * 
 * IMPORTANT: This prototype does NOT fabricate regulatory thresholds.
 * Claims are verified against configurable rules. Unverified rules
 * produce "unable_to_verify" or "attention" statuses.
 */

import type {
  ClaimStatus,
  ClaimVerification,
  FoodClaim,
  NutritionData,
} from "@/types/food";
import { findRuleForClaim } from "@/data/fssaiRules";

/**
 * Verify a single food claim against nutrition data and the rule engine.
 */
export function verifyClaim(
  claim: FoodClaim,
  nutrition: NutritionData,
): ClaimVerification {
  const rule = findRuleForClaim(claim.text);

  // No rule found at all
  if (!rule) {
    return {
      claim: claim.text,
      status: "unable_to_verify",
      declaredValue: "N/A",
      reason:
        "No verification rule is configured for this claim in the prototype. The claim cannot be automatically verified.",
      ruleSource: "N/A",
    };
  }

  // Rule exists but requires verification
  if (rule.rule_status === "requires_verified_rule") {
    return {
      claim: claim.text,
      status: "attention",
      declaredValue: getDeclaredValue(claim, nutrition),
      reason:
        "The declared nutrition information should be checked against the applicable regulatory criteria before treating this claim as supported. No verified FSSAI rule is configured yet for this prototype.",
      ruleSource: rule.source,
    };
  }

  // Verified rule (future path)
  return {
    claim: claim.text,
    status: "supported",
    declaredValue: getDeclaredValue(claim, nutrition),
    reason: rule.description,
    ruleSource: rule.source,
  };
}

/**
 * Get the declared value string for a claim's associated nutrient.
 */
function getDeclaredValue(
  claim: FoodClaim,
  nutrition: NutritionData,
): string {
  const nutrient = claim.nutrient as keyof NutritionData;
  const value = nutrition[nutrient];

  if (value === undefined) return "Not declared";

  const units: Record<string, string> = {
    energy: "kcal",
    protein: "g",
    carbohydrates: "g",
    sugar: "g",
    totalFat: "g",
    saturatedFat: "g",
    sodium: "mg",
    fibre: "g",
    calcium: "mg",
  };

  return `${value} ${units[claim.nutrient] || ""}`.trim();
}

/**
 * Verify all claims for a food product.
 */
export function verifyAllClaims(
  claims: FoodClaim[],
  nutrition: NutritionData,
): ClaimVerification[] {
  return claims.map((claim) => verifyClaim(claim, nutrition));
}

/**
 * Get a human-readable label for claim status.
 */
export function getClaimStatusLabel(status: ClaimStatus): string {
  switch (status) {
    case "supported":
      return "Supported";
    case "attention":
      return "Needs Attention";
    case "not_supported":
      return "Not Supported";
    case "unable_to_verify":
      return "Unable to Verify";
  }
}

/**
 * Get badge variant for claim status.
 */
export function getClaimStatusBadge(status: ClaimStatus): string {
  switch (status) {
    case "supported":
      return "good";
    case "attention":
      return "attention";
    case "not_supported":
      return "poor";
    case "unable_to_verify":
      return "info";
  }
}
