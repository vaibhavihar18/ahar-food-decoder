/**
 * AHAR X — FSSAI Rule Engine Data
 * 
 * JSON/database-ready rule structure for food claim verification.
 * 
 * IMPORTANT: These are prototype rules. They do NOT represent actual FSSAI regulations.
 * Real FSSAI rules must be added from verified regulatory documents before production use.
 * 
 * The system is designed so that verified rules can be swapped in easily.
 */

import type { FSSAIRule } from "@/types/food";

/**
 * Prototype rules for claim verification.
 * rule_status:
 *   - "verified": Rule has been verified against regulatory source
 *   - "requires_verified_rule": No verified rule available yet
 */
export const FSSAI_RULES: FSSAIRule[] = [
  {
    claim: "High Protein",
    nutrient: "protein",
    rule_status: "requires_verified_rule",
    source: "FSSAI (Prototype)",
    description:
      "No verified FSSAI threshold configured for 'High Protein' in this prototype. The declared value is shown for reference.",
  },
  {
    claim: "Source of Fibre",
    nutrient: "fibre",
    rule_status: "requires_verified_rule",
    source: "FSSAI (Prototype)",
    description:
      "No verified FSSAI threshold configured for 'Source of Fibre' in this prototype. The declared value is shown for reference.",
  },
  {
    claim: "Source of Calcium",
    nutrient: "calcium",
    rule_status: "requires_verified_rule",
    source: "FSSAI (Prototype)",
    description:
      "No verified FSSAI threshold configured for 'Source of Calcium' in this prototype. The declared value is shown for reference.",
  },
  {
    claim: "Low Sugar",
    nutrient: "sugar",
    rule_status: "requires_verified_rule",
    source: "FSSAI (Prototype)",
    description:
      "No verified FSSAI threshold configured for 'Low Sugar' in this prototype.",
  },
  {
    claim: "Low Fat",
    nutrient: "totalFat",
    rule_status: "requires_verified_rule",
    source: "FSSAI (Prototype)",
    description:
      "No verified FSSAI threshold configured for 'Low Fat' in this prototype.",
  },
  {
    claim: "Sugar Free",
    nutrient: "sugar",
    rule_status: "requires_verified_rule",
    source: "FSSAI (Prototype)",
    description:
      "No verified FSSAI threshold configured for 'Sugar Free' in this prototype.",
  },
];

/**
 * Find the rule for a given claim text.
 * Returns the matching rule or undefined if not found.
 */
export function findRuleForClaim(claimText: string): FSSAIRule | undefined {
  const normalized = claimText.toLowerCase().trim();
  return FSSAI_RULES.find(
    (rule) => rule.claim.toLowerCase().trim() === normalized,
  );
}
