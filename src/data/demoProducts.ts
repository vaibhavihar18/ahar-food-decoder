/**
 * AHAR X — Demo Product Data
 * Three pre-built food products for the prototype demo.
 * All data is mock/demo data — clearly marked as such.
 */

import type { FoodProduct } from "@/types/food";

export const DEMO_PRODUCTS: FoodProduct[] = [
  {
    id: "demo-1",
    name: "Chocolate Cereal",
    imageUrl: "",
    nutrition: {
      energy: 450,
      protein: 8,
      carbohydrates: 65,
      sugar: 22,
      totalFat: 18,
      saturatedFat: 7,
      sodium: 320,
    },
    ingredients: [
      "Wheat flour",
      "Sugar",
      "Cocoa powder",
      "Palm oil",
      "Salt",
      "Baking soda",
      "Natural flavor",
    ],
    claims: [{ text: "High Protein", nutrient: "protein" }],
    isDemo: true,
  },
  {
    id: "demo-2",
    name: "Oat Biscuits",
    imageUrl: "",
    nutrition: {
      energy: 480,
      protein: 7,
      carbohydrates: 58,
      sugar: 18,
      totalFat: 21,
      saturatedFat: 9,
      sodium: 350,
    },
    ingredients: [
      "Oats",
      "Wheat flour",
      "Sugar",
      "Vegetable oil",
      "Honey",
      "Salt",
      "Baking powder",
    ],
    claims: [{ text: "Source of Fibre", nutrient: "fibre" }],
    isDemo: true,
  },
  {
    id: "demo-3",
    name: "Plain Milk",
    imageUrl: "",
    nutrition: {
      energy: 60,
      protein: 3.2,
      carbohydrates: 4.8,
      sugar: 5,
      totalFat: 3.2,
      saturatedFat: 2.1,
      sodium: 44,
    },
    ingredients: ["Milk"],
    claims: [{ text: "Source of Calcium", nutrient: "calcium" }],
    isDemo: true,
  },
];

// Product placeholder icons/emojis for demo display
export const PRODUCT_EMOJIS: Record<string, string> = {
  "demo-1": "🥣",
  "demo-2": "🍪",
  "demo-3": "🥛",
};
