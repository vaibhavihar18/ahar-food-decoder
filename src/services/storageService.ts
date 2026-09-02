/**
 * AHAR X — Storage Service
 * 
 * Local storage abstraction for the prototype.
 * Structured so PostgreSQL can replace localStorage later.
 * 
 * Tables (when PostgreSQL is used):
 *   - users: User profile data
 *   - foods: Food product data
 *   - nutrition: Nutrition values
 *   - ingredients: Ingredient lists
 *   - claims: Food claims
 *   - analyses: Complete analysis results
 *   - scan_history: User's scan history
 * 
 * For now, everything is stored in localStorage.
 */

import type { FoodAnalysis, HistoryEntry, UserProfile } from "@/types/food";

interface StorageData {
  profile: UserProfile | null;
  history: HistoryEntry[];
  currentAnalysis: FoodAnalysis | null;
}

const STORAGE_KEY = "ahar_x_data";

/**
 * Get the default (empty) storage state.
 */
function getDefaultStorage(): StorageData {
  return {
    profile: null,
    history: [],
    currentAnalysis: null,
  };
}

/**
 * Load all data from localStorage.
 */
export function getStorage(): StorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultStorage();
    return JSON.parse(raw) as StorageData;
  } catch {
    return getDefaultStorage();
  }
}

/**
 * Save all data to localStorage.
 */
function saveStorage(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn("Failed to save to localStorage");
  }
}

// ─── Profile ────────────────────────────────────────────────────

export function getProfile(): UserProfile | null {
  return getStorage().profile;
}

export function saveProfile(profile: UserProfile): void {
  const data = getStorage();
  data.profile = profile;
  saveStorage(data);
}

export function hasProfile(): boolean {
  return getStorage().profile !== null;
}

// ─── History ────────────────────────────────────────────────────

export function getHistory(): HistoryEntry[] {
  return getStorage().history;
}

export function saveToHistory(entry: HistoryEntry): void {
  const data = getStorage();
  // Avoid duplicates
  const exists = data.history.find((h) => h.id === entry.id);
  if (!exists) {
    data.history.unshift(entry);
    // Keep last 50 entries
    if (data.history.length > 50) {
      data.history = data.history.slice(0, 50);
    }
    saveStorage(data);
  }
}

export function getHistoryEntry(id: string): HistoryEntry | undefined {
  return getStorage().history.find((h) => h.id === id);
}

// ─── Current Analysis ───────────────────────────────────────────

export function getCurrentAnalysis(): FoodAnalysis | null {
  return getStorage().currentAnalysis;
}

export function saveCurrentAnalysis(analysis: FoodAnalysis): void {
  const data = getStorage();
  data.currentAnalysis = analysis;
  saveStorage(data);
}

// ─── Clear ──────────────────────────────────────────────────────

export function clearCurrentAnalysis(): void {
  const data = getStorage();
  data.currentAnalysis = null;
  saveStorage(data);
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
