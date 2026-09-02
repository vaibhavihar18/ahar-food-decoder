/**
 * AHAR X — Scanner Page
 * 
 * The food scanning page with three input modes:
 *   1. Upload image
 *   2. Camera (if browser supports it)
 *   3. Demo products
 * 
 * After selecting an image/product, shows an analyzing animation
 * with the step-by-step pipeline, then navigates to the result page.
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppLayout } from "@/components/AppLayout";
import {
  Upload,
  Camera,
  Zap,
  X,
  Image as ImageIcon,
  ScanLine,
  Loader2,
} from "lucide-react";
import { useAnalysisContext } from "@/contexts/AnalysisContext";
import { DEMO_PRODUCTS, PRODUCT_EMOJIS } from "@/data/demoProducts";
import { validateImageFile } from "@/services/ocrService";
import { runFullAnalysis, ANALYSIS_STEPS } from "@/services/analysisOrchestrator";
import { getProfile, saveCurrentAnalysis } from "@/services/storageService";
import { type AnalysisStep, type FoodProduct } from "@/types/food";

export default function Scanner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    setCurrentAnalysis,
    setCurrentStep,
    setIsAnalyzing,
    clearAnalysis,
  } = useAnalysisContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showDemoPanel, setShowDemoPanel] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);

  // Auto-open demo panel if ?demo=true
  useEffect(() => {
    if (searchParams.get("demo") === "true") {
      setShowDemoPanel(true);
    }
  }, [searchParams]);

  const profile = getProfile();

  // ─── File Handling ────────────────────────────────────────

  const handleFileSelect = useCallback((file: File) => {
    setError("");
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const removeFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
  };

  // ─── Analysis Animation ───────────────────────────────────

  const runAnalysis = async (product: FoodProduct) => {
    setAnalyzing(true);
    setIsAnalyzing(true);
    setError("");
    setCurrentStep("scanning");

    // Animate through each step
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setCurrentStepIdx(i);
      setCurrentStep(ANALYSIS_STEPS[i].key);
      await new Promise((resolve) => setTimeout(resolve, 900));
    }

    // Run the actual analysis
    const goal = profile?.goal || "general_healthy";
    const result = runFullAnalysis(product, goal);

    setCurrentAnalysis(result);
    saveCurrentAnalysis(result);
    setIsAnalyzing(false);
    setAnalyzing(false);
    setCurrentStep(null);
    setCurrentStepIdx(-1);

    // Navigate to the analysis result page
    navigate(`/analysis/${result.id}`);
  };

  // ─── Handle "Analyze Food" button click ───────────────────
  const handleAnalyze = () => {
    if (!selectedFile) return;

    // Since OCR isn't configured, show error message
    setError(
      "OCR is not configured in this prototype. Please use the demo products below to see the full analysis pipeline.",
    );
  };

  return (
    <AppLayout>
      <div className="px-6 pt-6 pb-4 max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900">Scan Food</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload a food label image or try a demo product
          </p>
        </motion.div>

        {/* Analyzing Animation Overlay */}
        <AnimatePresence>
          {analyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <div className="text-center px-8 max-w-sm">
                <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ScanLine className="h-8 w-8 text-sky-500 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Analyzing Food
                </h2>

                <div className="space-y-3 text-left">
                  {ANALYSIS_STEPS.map((step, i) => (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: i <= currentStepIdx ? 1 : 0.3,
                        x: 0,
                      }}
                      className="flex items-center gap-3"
                    >
                      {i < currentStepIdx ? (
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      ) : i === currentStepIdx ? (
                        <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center shrink-0">
                          <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded-full shrink-0" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          i <= currentStepIdx
                            ? "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Area */}
        {!analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {!selectedFile ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-sky-200 rounded-2xl p-10 text-center cursor-pointer hover:border-sky-400 hover:bg-sky-50/50 transition-all"
              >
                <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-7 w-7 text-sky-500" />
                </div>
                <p className="font-semibold text-gray-700">
                  Upload food label image
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Drag & drop or tap to select
                </p>
                <p className="text-xs text-gray-300 mt-3">
                  JPEG, PNG, WebP — Max 10MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
                  {/* Preview */}
                  <div className="relative aspect-video bg-gray-50">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Food label preview"
                        className="w-full h-full object-contain"
                      />
                    )}
                    <button
                      onClick={removeFile}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* File info */}
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-sky-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(selectedFile.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Analyze Button */}
                <Button
                  onClick={handleAnalyze}
                  className="w-full mt-3 bg-sky-500 hover:bg-sky-600 text-white py-5 rounded-xl font-semibold shadow-md shadow-sky-200"
                >
                  <ScanLine className="mr-2 h-5 w-5" />
                  Analyze Food
                </Button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3"
              >
                <p className="text-sm text-amber-700">{error}</p>
              </motion.div>
            )}

            {/* Camera button (if supported) */}
            <div className="flex items-center gap-3 mt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileInput}
                className="hidden"
              />
              <Button
                variant="outline"
                className="flex-1 border-sky-200 text-sky-700 hover:bg-sky-50"
                onClick={() => {
                  // Try to use camera via file input
                  if (fileInputRef.current) {
                    fileInputRef.current.removeAttribute("capture");
                    fileInputRef.current.click();
                  }
                }}
              >
                <Camera className="mr-2 h-4 w-4" />
                Use Camera
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-sky-200 text-sky-700 hover:bg-sky-50"
                onClick={() => setShowDemoPanel(!showDemoPanel)}
              >
                <Zap className="mr-2 h-4 w-4" />
                Try Demo
              </Button>
            </div>

            {/* Demo Products Panel */}
            <AnimatePresence>
              {showDemoPanel && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Card className="mt-4 border-sky-100 shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs font-medium text-sky-600 uppercase tracking-wider mb-3">
                        Demo Products
                      </p>
                      <div className="space-y-2">
                        {DEMO_PRODUCTS.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => runAnalysis(product)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-sky-200 hover:bg-sky-50/50 transition-all text-left"
                          >
                            <span className="text-2xl">
                              {PRODUCT_EMOJIS[product.id] || "🍽️"}
                            </span>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {product.nutrition.energy} kcal ·{" "}
                                {product.nutrition.protein}g protein ·{" "}
                                {product.nutrition.sugar}g sugar
                              </p>
                            </div>
                            <Zap className="h-4 w-4 text-amber-400" />
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-3 text-center">
                        Demo data — not from real OCR extraction
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
