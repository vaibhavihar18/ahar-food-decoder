/**
 * AHAR X — Dashboard (Home) Page
 * 
 * The main authenticated home screen with:
 *   - Welcome message with user name
 *   - Current goal display
 *   - Quick action buttons (Scan Food, Try Demo)
 *   - Recent scan history
 *   - Quick nutrition summary
 * 
 * Protected by RequireAuth wrapper.
 */

import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppLayout } from "@/components/AppLayout";
import {
  ScanLine,
  Zap,
  TrendingUp,
  ArrowRight,
  Apple,
  LogOut,
} from "lucide-react";
import { getProfile, getHistory, clearAllData } from "@/services/storageService";
import { GOAL_LABELS, type UserProfile } from "@/types/food";
import { PRODUCT_EMOJIS } from "@/data/demoProducts";

export default function Dashboard() {
  const navigate = useNavigate();
  const profile = getProfile();
  const history = getHistory();

  // Redirect to profile setup if no profile exists
  useEffect(() => {
    if (!profile) {
      navigate("/profile-setup", { replace: true });
    }
  }, [profile, navigate]);

  if (!profile) return null;

  const recentScans = history.slice(0, 3);

  const handleLogout = () => {
    clearAllData();
    navigate("/");
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
            <p className="text-sm text-gray-400 font-medium">Welcome back</p>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile.name} 👋
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Goal Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-sky-500 to-blue-500 border-0 text-white shadow-lg shadow-sky-200 mb-5">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-sky-100" />
                <span className="text-xs font-medium text-sky-100 uppercase tracking-wider">
                  Your Goal
                </span>
              </div>
              <p className="text-lg font-bold">{GOAL_LABELS[profile.goal]}</p>
              <p className="text-sm text-sky-100 mt-1">
                Tap "Scan Food" to check if a product matches your goal
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <button
            onClick={() => navigate("/scan")}
            className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-200 transition-all text-left group"
          >
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center mb-3 shadow-sm shadow-sky-200 group-hover:scale-110 transition-transform">
              <ScanLine className="h-5 w-5 text-white" />
            </div>
            <p className="font-semibold text-gray-900 text-sm">Scan Food</p>
            <p className="text-xs text-gray-400 mt-1">Upload or photograph</p>
          </button>

          <button
            onClick={() => navigate("/scan?demo=true")}
            className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-200 transition-all text-left group"
          >
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center mb-3 shadow-sm shadow-amber-200 group-hover:scale-110 transition-transform">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <p className="font-semibold text-gray-900 text-sm">Try Demo</p>
            <p className="text-xs text-gray-400 mt-1">Sample analysis</p>
          </button>
        </motion.div>

        {/* Recent Scans */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Recent Scans</h2>
            {history.length > 0 && (
              <button
                onClick={() => navigate("/history")}
                className="text-xs font-medium text-sky-500 hover:text-sky-600 flex items-center gap-1"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>

          {recentScans.length === 0 ? (
            <Card className="border-sky-100 border-dashed">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Apple className="h-6 w-6 text-sky-300" />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  No scans yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Scan a food product or try a demo to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {recentScans.map((scan, i) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <button
                    onClick={() => navigate(`/analysis/${scan.id}`)}
                    className="w-full flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 hover:border-sky-200 hover:shadow-sm transition-all text-left"
                  >
                    <span className="text-2xl">
                      {PRODUCT_EMOJIS[scan.productName] || "🍽️"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {scan.productName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(scan.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`text-lg font-bold ${
                          scan.overallStatus === "good"
                            ? "text-emerald-500"
                            : scan.overallStatus === "moderate"
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      >
                        {scan.aharScore}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {scan.overallStatus}
                      </p>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 mb-4"
        >
          <Card className="bg-sky-50/50 border-sky-100">
            <CardContent className="p-4">
              <p className="text-xs text-sky-700 leading-relaxed">
                <strong>AHAR X</strong> — Decode Your Food. This is a prototype
                for SIH 2026. Regulatory verification uses prototype rules and
                should not be considered legal or medical advice.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
