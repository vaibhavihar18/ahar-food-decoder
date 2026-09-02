/**
 * AHAR X — History Page
 * 
 * Displays the user's scan history with:
 *   - List of past analyses with scores
 *   - Click to view full analysis
 *   - Empty state when no history
 * 
 * Data is persisted in localStorage (structured for PostgreSQL replacement).
 */

import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AppLayout } from "@/components/AppLayout";
import { Apple, ScanLine, Trash2 } from "lucide-react";
import { getHistory, clearAllData } from "@/services/storageService";
import { PRODUCT_EMOJIS } from "@/data/demoProducts";

export default function History() {
  const navigate = useNavigate();
  const history = getHistory();

  const handleClearHistory = () => {
    if (confirm("Clear all scan history? This cannot be undone.")) {
      // Only clear history, keep profile
      const profile = JSON.parse(
        localStorage.getItem("ahar_x_data") || "{}",
      ).profile;
      localStorage.setItem(
        "ahar_x_data",
        JSON.stringify({ profile, history: [], currentAnalysis: null }),
      );
      navigate("/history", { replace: true });
    }
  };

  return (
    <AppLayout>
      <div className="px-6 pt-6 pb-4 max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scan History</h1>
            <p className="text-sm text-gray-500 mt-1">
              {history.length} scan{history.length !== 1 ? "s" : ""} completed
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </motion.div>

        {/* History List */}
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-sky-100 border-dashed">
              <CardContent className="p-12 text-center">
                <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Apple className="h-7 w-7 text-sky-300" />
                </div>
                <p className="font-semibold text-gray-500">No scans yet</p>
                <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
                  Scan a food product to see your analysis history here
                </p>
                <button
                  onClick={() => navigate("/scan")}
                  className="mt-6 inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow-md shadow-sky-200 transition-all"
                >
                  <ScanLine className="h-4 w-4" />
                  Scan Food
                </button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {history.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <button
                  onClick={() => navigate(`/analysis/${entry.id}`)}
                  className="w-full bg-white rounded-2xl p-4 border border-gray-100 hover:border-sky-200 hover:shadow-sm transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">
                      {PRODUCT_EMOJIS[entry.productName] || "🍽️"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {entry.productName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(entry.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`text-2xl font-bold ${
                          entry.overallStatus === "good"
                            ? "text-emerald-500"
                            : entry.overallStatus === "moderate"
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      >
                        {entry.aharScore}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {entry.overallStatus}
                      </p>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
