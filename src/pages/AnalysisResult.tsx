/**
 * AHAR X — Analysis Result Page
 * 
 * Displays the complete analysis result including:
 *   - AHAR Score with breakdown
 *   - Nutrition analysis
 *   - Ingredient analysis
 *   - Claim verification
 *   - Personalization
 *   - Final insight & recommendation
 * 
 * This is the core "Decode → Verify → Personalize → Explain" page.
 */

import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppLayout } from "@/components/AppLayout";
import {
  ArrowLeft,
  ScanLine,
  Apple,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import { getCurrentAnalysis, getHistoryEntry } from "@/services/storageService";
import { type FoodAnalysis, type ClaimStatus } from "@/types/food";
import { PRODUCT_EMOJIS } from "@/data/demoProducts";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function AnalysisResult() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Try current analysis first, then history
  let analysis: FoodAnalysis | null = getCurrentAnalysis();
  if (!analysis && id) {
    const entry = getHistoryEntry(id);
    if (entry) analysis = entry.analysis;
  }

  if (!analysis) {
    return (
      <AppLayout>
        <div className="px-6 pt-6 max-w-lg mx-auto">
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Apple className="h-7 w-7 text-gray-300" />
            </div>
            <p className="font-medium text-gray-500">No analysis found</p>
            <p className="text-sm text-gray-400 mt-1">
              Scan a product to see results
            </p>
            <Button
              onClick={() => navigate("/scan")}
              className="mt-6 bg-sky-500 hover:bg-sky-600 text-white"
            >
              <ScanLine className="mr-2 h-4 w-4" />
              Scan Food
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const { product, aharScore, nutritionStatuses, ingredientCategories, claimVerifications, personalization, finalInsight, recommendation } =
    analysis;

  return (
    <AppLayout>
      <div className="px-6 pt-6 pb-4 max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Food Insight</h1>
            <p className="text-xs text-gray-400">
              {product.isDemo ? "Demo analysis" : "Analysis result"}
            </p>
          </div>
        </motion.div>

        {/* ── Product Header ── */}
        <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
          <Card className="border-sky-100 shadow-sm mb-4 overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <span className="text-4xl">
                  {PRODUCT_EMOJIS[product.id] || "🍽️"}
                </span>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900">
                    {product.name}
                  </h2>
                  {product.isDemo && (
                    <span className="inline-block mt-1 text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      DEMO DATA
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── AHAR Score ── */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <Card className="border-sky-100 shadow-sm overflow-hidden">
            <div
              className={`p-5 ${
                aharScore.overallStatus === "good"
                  ? "bg-gradient-to-r from-emerald-50 to-green-50"
                  : aharScore.overallStatus === "moderate"
                    ? "bg-gradient-to-r from-amber-50 to-yellow-50"
                    : "bg-gradient-to-r from-red-50 to-rose-50"
              }`}
            >
              <div className="text-center">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  AHAR Score
                </p>
                <p
                  className={`text-5xl font-bold ${
                    aharScore.overallStatus === "good"
                      ? "text-emerald-600"
                      : aharScore.overallStatus === "moderate"
                        ? "text-amber-600"
                        : "text-red-600"
                  }`}
                >
                  {aharScore.total}
                  <span className="text-2xl font-normal text-gray-400">
                    /100
                  </span>
                </p>
                <p className="text-sm font-medium text-gray-600 mt-1 capitalize">
                  {aharScore.overallStatus === "good"
                    ? "✓ Good"
                    : aharScore.overallStatus === "moderate"
                      ? "⚠ Moderate"
                      : "✕ Attention needed"}
                </p>
              </div>
            </div>

            {/* Score Breakdown */}
            <CardContent className="p-5">
              <div className="space-y-3">
                {Object.entries(aharScore.breakdown).map(([key, val]) => {
                  const labels: Record<string, string> = {
                    nutrition: "Nutrition",
                    ingredients: "Ingredients",
                    claims: "Claims",
                    personalGoal: "Personal Goal",
                  };
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {labels[key] || key}
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            val.status === "good"
                              ? "text-emerald-600"
                              : val.status === "attention"
                                ? "text-amber-600"
                                : "text-red-600"
                          }`}
                        >
                          {val.score}/{val.max}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(val.score / val.max) * 100}%`,
                          }}
                          transition={{
                            delay: 0.5,
                            duration: 0.8,
                            ease: "easeOut",
                          }}
                          className={`h-1.5 rounded-full ${
                            val.status === "good"
                              ? "bg-emerald-500"
                              : val.status === "attention"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Nutrition Analysis ── */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <div className="w-6 h-6 bg-sky-100 rounded-lg flex items-center justify-center">
              <Apple className="h-3.5 w-3.5 text-sky-600" />
            </div>
            Nutrition
          </h3>
          <Card className="border-sky-100 shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                {nutritionStatuses.map((ns) => (
                  <div
                    key={ns.key}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {ns.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {ns.value} {ns.unit}
                      </p>
                    </div>
                    <StatusBadge status={ns.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Ingredient Analysis ── */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-3.5 w-3.5 text-blue-600" />
            </div>
            Ingredients
          </h3>
          <Card className="border-sky-100 shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                {ingredientCategories.map((cat) => (
                  <div
                    key={cat.category}
                    className="py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          cat.status === "warning"
                            ? "bg-amber-50 text-amber-700"
                            : cat.status === "present"
                              ? "bg-sky-50 text-sky-700"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {cat.status === "warning"
                          ? "⚠"
                          : cat.status === "present"
                            ? "ℹ"
                            : "✓"}{" "}
                        {cat.label}
                      </span>
                      <span
                        className={`text-[10px] font-medium uppercase ${
                          cat.status === "warning"
                            ? "text-amber-600"
                            : cat.status === "present"
                              ? "text-sky-600"
                              : "text-emerald-600"
                        }`}
                      >
                        {cat.status === "warning"
                          ? "Present"
                          : cat.status === "present"
                            ? "Detected"
                            : "None detected"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 ml-1">
                      {cat.explanation}
                    </p>
                    {cat.items.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1 ml-1">
                        Items: {cat.items.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Claim Verification ── */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.4 }}
          className="mb-4"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <div className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-violet-600" />
            </div>
            Claim Verification
          </h3>
          <Card className="border-sky-100 shadow-sm">
            <CardContent className="p-4">
              {claimVerifications.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  No claims found on this product
                </p>
              ) : (
                <div className="space-y-3">
                  {claimVerifications.map((cv, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900 text-sm">
                          "{cv.claim}"
                        </p>
                        <ClaimStatusBadge status={cv.status} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">
                          <strong>Declared Value:</strong> {cv.declaredValue}
                        </p>
                        <p className="text-xs text-gray-500">{cv.reason}</p>
                        <p className="text-[10px] text-gray-400 italic">
                          Source: {cv.ruleSource}
                        </p>
                      </div>
                    </div>
                  ))}
                  <p className="text-[10px] text-gray-400 text-center pt-1">
                    Regulatory verification is based on the rules configured in
                    the prototype and should not be considered legal or medical
                    advice.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Personalization ── */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.5 }}
          className="mb-4"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            Personal Goal Match
          </h3>
          <Card className="border-sky-100 shadow-sm">
            <CardContent className="p-4">
              <div
                className={`p-3 rounded-xl ${
                  personalization.status === "ideal"
                    ? "bg-emerald-50 border border-emerald-100"
                    : personalization.status === "moderate"
                      ? "bg-amber-50 border border-amber-100"
                      : "bg-red-50 border border-red-100"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-sm font-bold ${
                      personalization.status === "ideal"
                        ? "text-emerald-700"
                        : personalization.status === "moderate"
                          ? "text-amber-700"
                          : "text-red-700"
                    }`}
                  >
                    {personalization.status === "ideal"
                      ? "✓ IDEAL"
                      : personalization.status === "moderate"
                        ? "⚠ MODERATE"
                        : "✕ NOT IDEAL"}
                  </span>
                  <span className="text-xs text-gray-500">
                    for {personalization.goalLabel}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  {personalization.summary}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {personalization.explanation}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Final Insight ── */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.6 }}
          className="mb-4"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Your Food Insight
          </h3>
          <Card
            className={`border shadow-sm ${
              aharScore.overallStatus === "good"
                ? "border-emerald-200 bg-emerald-50/30"
                : aharScore.overallStatus === "moderate"
                  ? "border-amber-200 bg-amber-50/30"
                  : "border-red-200 bg-red-50/30"
            }`}
          >
            <CardContent className="p-5">
              <div className="text-center mb-4">
                <p
                  className={`text-lg font-bold ${
                    aharScore.overallStatus === "good"
                      ? "text-emerald-600"
                      : aharScore.overallStatus === "moderate"
                        ? "text-amber-600"
                        : "text-red-600"
                  }`}
                >
                  {aharScore.overallStatus === "good"
                    ? "✓ GOOD"
                    : aharScore.overallStatus === "moderate"
                      ? "⚠ MODERATE"
                      : "✕ ATTENTION"}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                {nutritionStatuses.slice(0, 4).map((ns) => (
                  <div key={ns.key} className="flex items-center gap-2">
                    {ns.status === "good" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    ) : ns.status === "attention" ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    )}
                    <span className="text-sm text-gray-700">
                      <strong>{ns.label}</strong> —{" "}
                      {ns.status === "good"
                        ? "Good"
                        : ns.status === "attention"
                          ? "Moderate"
                          : "High"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl p-3 border border-gray-100 mb-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-sky-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {finalInsight}
                  </p>
                </div>
              </div>

              <div className="bg-sky-50 rounded-xl p-3 border border-sky-100">
                <p className="text-xs font-medium text-sky-700 mb-1">
                  RECOMMENDATION
                </p>
                <p className="text-sm text-gray-700">{recommendation}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Disclaimer ── */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.7 }}
          className="mb-20"
        >
          <Card className="bg-gray-50 border-gray-100">
            <CardContent className="p-3">
              <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                AHAR X is a prototype for SIH 2026. Analysis results are based
                on rule-based interpretation and should not be considered
                medical, nutritional, or legal advice. Always consult a
                healthcare professional for dietary decisions.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => navigate("/scan")}
              className="flex-1 bg-sky-500 hover:bg-sky-600 text-white rounded-xl py-5"
            >
              <ScanLine className="mr-2 h-4 w-4" />
              Scan Another
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="flex-1 border-sky-200 text-sky-700 hover:bg-sky-50 rounded-xl py-5"
            >
              Home
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}

// ─── Sub-components ──────────────────────────────────────────────

function StatusBadge({ status }: { status: "good" | "attention" | "high" }) {
  if (status === "good")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
        <CheckCircle2 className="h-3 w-3" />
        Good
      </span>
    );
  if (status === "attention")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
        <AlertTriangle className="h-3 w-3" />
        Moderate
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
      <XCircle className="h-3 w-3" />
      High
    </span>
  );
}

function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  const config: Record<
    ClaimStatus,
    { label: string; classes: string; icon: React.ReactNode }
  > = {
    supported: {
      label: "Supported",
      classes: "bg-emerald-50 text-emerald-700 border-emerald-100",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    attention: {
      label: "Needs Attention",
      classes: "bg-amber-50 text-amber-700 border-amber-100",
      icon: <AlertTriangle className="h-3 w-3" />,
    },
    not_supported: {
      label: "Not Supported",
      classes: "bg-red-50 text-red-700 border-red-100",
      icon: <XCircle className="h-3 w-3" />,
    },
    unable_to_verify: {
      label: "Unable to Verify",
      classes: "bg-gray-50 text-gray-600 border-gray-200",
      icon: <Info className="h-3 w-3" />,
    },
  };

  const c = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${c.classes}`}
    >
      {c.icon}
      {c.label}
    </span>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
