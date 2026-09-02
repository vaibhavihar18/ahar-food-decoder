/**
 * AHAR X — Ingredient Analysis Service
 * 
 * Categorizes parsed ingredients into groups and provides
 * simple explanations for each category.
 */

import type {
  IngredientCategory,
  IngredientCategoryResult,
  ParsedIngredient,
} from "@/types/food";

/**
 * Ingredient classification map.
 * Maps ingredient names (lowercase) to their category.
 * This is a simplified prototype — a real system would use NLP/AI.
 */
const INGREDIENT_MAP: Record<string, IngredientCategory> = {
  // Added Sugars
  sugar: "added_sugar",
  "cane sugar": "added_sugar",
  "brown sugar": "added_sugar",
  "corn syrup": "added_sugar",
  honey: "added_sugar",
  "high fructose corn syrup": "added_sugar",
  dextrose: "added_sugar",
  fructose: "added_sugar",
  maltose: "added_sugar",
  sucrose: "added_sugar",

  // Oils/Fats
  "palm oil": "oils_fats",
  "vegetable oil": "oils_fats",
  "sunflower oil": "oils_fats",
  "soybean oil": "oils_fats",
  "canola oil": "oils_fats",
  "coconut oil": "oils_fats",
  "olive oil": "oils_fats",
  butter: "oils_fats",
  ghee: "oils_fats",
  lard: "oils_fats",

  // Preservatives
  "sodium benzoate": "preservatives",
  "potassium sorbate": "preservatives",
  "sodium nitrite": "preservatives",
  "sodium nitrate": "preservatives",
  "calcium propionate": "preservatives",
  bha: "preservatives",
  bht: "preservatives",
  "tbhq": "preservatives",

  // Additives
  "artificial flavor": "additives",
  "natural flavor": "additives",
  "artificial color": "additives",
  "food coloring": "additives",
  msg: "additives",
  "monosodium glutamate": "additives",
  aspartame: "additives",
  "sucralose": "additives",

  // Allergens
  wheat: "allergens",
  milk: "allergens",
  eggs: "allergens",
  peanuts: "allergens",
  "tree nuts": "allergens",
  soy: "allergens",
  fish: "allergens",
  shellfish: "allergens",
  sesame: "allergens",
  gluten: "allergens",
};

/**
 * Classify a single ingredient name into a category.
 */
function classifyIngredient(name: string): ParsedIngredient {
  const lower = name.toLowerCase().trim();
  const category = INGREDIENT_MAP[lower] || "other";
  return { name, category };
}

/**
 * Category display configuration.
 */
const CATEGORY_CONFIG: Record<
  IngredientCategory,
  { label: string; emoji: string }
> = {
  added_sugar: { label: "Added Sugar", emoji: "🍬" },
  oils_fats: { label: "Oils / Fats", emoji: "🫒" },
  preservatives: { label: "Preservatives", emoji: "🧪" },
  additives: { label: "Additives", emoji: "⚗️" },
  allergens: { label: "Allergens", emoji: "⚠️" },
  other: { label: "Other Ingredients", emoji: "📋" },
};

/**
 * Analyze a list of ingredient strings and return categorized results.
 */
export function analyzeIngredients(
  ingredientList: string[],
): IngredientCategoryResult[] {
  const parsed = ingredientList.map(classifyIngredient);

  // Group by category
  const grouped: Record<IngredientCategory, string[]> = {
    added_sugar: [],
    oils_fats: [],
    preservatives: [],
    additives: [],
    allergens: [],
    other: [],
  };

  for (const item of parsed) {
    grouped[item.category].push(item.name);
  }

  // Build results for categories that have items (skip "other" if empty)
  const results: IngredientCategoryResult[] = [];

  for (const [cat, items] of Object.entries(grouped) as [
    IngredientCategory,
    string[],
  ][]) {
    if (items.length === 0) continue;

    const config = CATEGORY_CONFIG[cat];

    let status: "present" | "warning" | "none";
    let explanation: string;

    if (cat === "allergens") {
      status = "warning";
      explanation = `⚠ Allergen detected: ${items.join(", ")}. Check for allergies before consumption.`;
    } else if (cat === "added_sugar") {
      status = "warning";
      explanation = `Added sugar detected (${items.join(", ")}). This increases the sugar content of the product.`;
    } else if (cat === "oils_fats") {
      status = "present";
      explanation = `Fat/oil source detected: ${items.join(", ")}.`;
    } else if (cat === "preservatives") {
      status = "present";
      explanation = `Preservatives detected: ${items.join(", ")}. These are used to extend shelf life.`;
    } else if (cat === "additives") {
      status = "present";
      explanation = `Food additives detected: ${items.join(", ")}.`;
    } else {
      status = "present";
      explanation = `Other ingredients: ${items.join(", ")}.`;
    }

    results.push({
      category: cat,
      label: config.label,
      status,
      items,
      explanation,
    });
  }

  // If no categories found (only "other"), add a "none detected" for key categories
  if (results.length <= 1) {
    const keyCategories: IngredientCategory[] = [
      "added_sugar",
      "oils_fats",
      "preservatives",
      "additives",
      "allergens",
    ];
    for (const cat of keyCategories) {
      if (grouped[cat].length === 0) {
        const config = CATEGORY_CONFIG[cat];
        results.unshift({
          category: cat,
          label: config.label,
          status: "none",
          items: [],
          explanation: `No ${config.label.toLowerCase()} detected in this product.`,
        });
      }
    }
  }

  return results;
}
