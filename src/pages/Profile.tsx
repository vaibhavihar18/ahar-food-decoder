/**
 * AHAR X — Profile Page
 * 
 * View and edit the user's profile including:
 *   - Name, age, food preference, goal
 *   - View scan count and stats
 *   - Edit profile details
 */

import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppLayout } from "@/components/AppLayout";
import {
  User,
  Edit3,
  Target,
  Apple,
  History,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { getProfile, getHistory, clearAllData } from "@/services/storageService";
import { GOAL_LABELS, GOAL_DESCRIPTIONS } from "@/types/food";

export default function Profile() {
  const navigate = useNavigate();
  const profile = getProfile();
  const history = getHistory();

  useEffect(() => {
    if (!profile) {
      navigate("/profile-setup", { replace: true });
    }
  }, [profile, navigate]);

  if (!profile) return null;

  const handleLogout = () => {
    clearAllData();
    navigate("/");
  };

  // Calculate stats
  const goodScans = history.filter((h) => h.overallStatus === "good").length;
  const moderateScans = history.filter(
    (h) => h.overallStatus === "moderate",
  ).length;
  const attentionScans = history.filter(
    (h) => h.overallStatus === "attention",
  ).length;

  return (
    <AppLayout>
      <div className="px-6 pt-6 pb-4 max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your preferences</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-sky-100 shadow-sm mb-4 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <User className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-sky-100 text-sm">
                    Age {profile.age} · {profile.foodPreference}
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-5">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center">
                    <Target className="h-4 w-4 text-sky-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Goal</p>
                    <p className="text-sm font-medium text-gray-900">
                      {GOAL_LABELS[profile.goal]}
                    </p>
                  </div>
                </div>

                <div className="bg-sky-50 rounded-xl p-3 border border-sky-100">
                  <p className="text-xs text-sky-700 leading-relaxed">
                    {GOAL_DESCRIPTIONS[profile.goal]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <Card className="border-sky-100 shadow-sm">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <History className="h-4 w-4 text-sky-500" />
                Scan Stats
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-600">
                    {goodScans}
                  </p>
                  <p className="text-[10px] text-emerald-700 uppercase tracking-wider mt-1">
                    Good
                  </p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <p className="text-2xl font-bold text-amber-600">
                    {moderateScans}
                  </p>
                  <p className="text-[10px] text-amber-700 uppercase tracking-wider mt-1">
                    Moderate
                  </p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-xl">
                  <p className="text-2xl font-bold text-red-600">
                    {attentionScans}
                  </p>
                  <p className="text-[10px] text-red-700 uppercase tracking-wider mt-1">
                    Attention
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 mb-20"
        >
          <Button
            onClick={() => navigate("/profile-setup")}
            variant="outline"
            className="w-full border-sky-200 text-sky-700 hover:bg-sky-50 justify-start py-5"
          >
            <Edit3 className="mr-3 h-4 w-4" />
            Edit Profile
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 justify-start py-5"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Clear Data & Sign Out
          </Button>

          <Card className="bg-gray-50 border-gray-100">
            <CardContent className="p-3">
              <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                <ShieldCheck className="h-3 w-3 inline mr-1" />
                AHAR X is a SIH 2026 prototype. Data is stored locally and not
                shared. In production, data would be stored securely in a
                PostgreSQL database.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
