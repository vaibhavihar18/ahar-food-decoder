/**
 * AHAR X — Analysis Context
 * 
 * Provides shared state for the food analysis pipeline across pages.
 * Manages the current analysis, analysis steps, and navigation state.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AnalysisStep, FoodAnalysis, FoodProduct } from "@/types/food";

interface AnalysisContextValue {
  /** The current completed analysis */
  currentAnalysis: FoodAnalysis | null;
  setCurrentAnalysis: (a: FoodAnalysis | null) => void;

  /** The product currently being analyzed */
  analyzingProduct: FoodProduct | null;
  setAnalyzingProduct: (p: FoodProduct | null) => void;

  /** Current analysis step (for animation) */
  currentStep: AnalysisStep | null;
  setCurrentStep: (s: AnalysisStep | null) => void;

  /** Whether analysis is in progress */
  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;

  /** Clear all analysis state */
  clearAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [currentAnalysis, setCurrentAnalysis] =
    useState<FoodAnalysis | null>(null);
  const [analyzingProduct, setAnalyzingProduct] =
    useState<FoodProduct | null>(null);
  const [currentStep, setCurrentStep] = useState<AnalysisStep | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const clearAnalysis = useCallback(() => {
    setCurrentAnalysis(null);
    setAnalyzingProduct(null);
    setCurrentStep(null);
    setIsAnalyzing(false);
  }, []);

  return (
    <AnalysisContext.Provider
      value={{
        currentAnalysis,
        setCurrentAnalysis,
        analyzingProduct,
        setAnalyzingProduct,
        currentStep,
        setCurrentStep,
        isAnalyzing,
        setIsAnalyzing,
        clearAnalysis,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysisContext(): AnalysisContextValue {
  const ctx = useContext(AnalysisContext);
  if (!ctx) {
    throw new Error("useAnalysisContext must be used within an AnalysisProvider");
  }
  return ctx;
}
