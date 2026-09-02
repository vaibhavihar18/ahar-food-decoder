/**
 * AHAR X — Profile Setup Page
 * 
 * Allows users to create their profile with:
 *   - Name
 *   - Age
 *   - Food preference
 *   - Health goal
 * 
 * Profile is saved to localStorage (structured for PostgreSQL replacement).
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, ArrowRight, User, CheckCircle2 } from "lucide-react";
import { saveProfile, getProfile } from "@/services/storageService";
import {
  type GoalType,
  GOAL_LABELS,
  GOAL_DESCRIPTIONS,
} from "@/types/food";

const GOALS: GoalType[] = [
  "weight_management",
  "muscle_gain",
  "general_healthy",
  "low_sugar",
  "low_sodium",
];

const FOOD_PREFERENCES = [
  "No preference",
  "Vegetarian",
  "Vegan",
  "Non-vegetarian",
  "Eggetarian",
];

export default function ProfileSetup() {
  const navigate = useNavigate();
  const existing = getProfile();

  const [name, setName] = useState(existing?.name || "");
  const [age, setAge] = useState(existing?.age?.toString() || "");
  const [foodPreference, setFoodPreference] = useState(
    existing?.foodPreference || "No preference",
  );
  const [goal, setGoal] = useState<GoalType>(
    existing?.goal || "general_healthy",
  );
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!age || parseInt(age) < 1 || parseInt(age) > 120) {
      setError("Please enter a valid age (1-120).");
      return;
    }

    saveProfile({
      id: existing?.id || `user-${Date.now()}`,
      name: name.trim(),
      age: parseInt(age),
      foodPreference,
      goal,
      createdAt: existing?.createdAt || Date.now(),
    });

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center">
            <Apple className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            AHAR <span className="text-sky-500">X</span>
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="h-7 w-7 text-sky-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {existing ? "Your Profile" : "Create Your Profile"}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Tell us about yourself for personalized food analysis
            </p>
          </div>

          <Card className="border-sky-100 shadow-lg shadow-sky-50">
            <CardContent className="p-6 space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  className="border-sky-100 focus:border-sky-400 focus:ring-sky-400"
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-gray-700 font-medium">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setError("");
                  }}
                  className="border-sky-100 focus:border-sky-400 focus:ring-sky-400"
                  min={1}
                  max={120}
                />
              </div>

              {/* Food Preference */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Food Preference
                </Label>
                <div className="flex flex-wrap gap-2">
                  {FOOD_PREFERENCES.map((pref) => (
                    <button
                      key={pref}
                      onClick={() => setFoodPreference(pref)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                        foodPreference === pref
                          ? "bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-200"
                          : "bg-white text-gray-600 border-gray-200 hover:border-sky-300"
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Health Goal
                </Label>
                <div className="space-y-2">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        goal === g
                          ? "bg-sky-50 border-sky-400 ring-1 ring-sky-200"
                          : "bg-white border-gray-200 hover:border-sky-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {goal === g && (
                          <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                        )}
                        <span
                          className={`font-medium text-sm ${
                            goal === g ? "text-sky-700" : "text-gray-700"
                          }`}
                        >
                          {GOAL_LABELS[g]}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-6">
                        {GOAL_DESCRIPTIONS[g]}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-6 rounded-xl font-semibold shadow-md shadow-sky-200 transition-all hover:shadow-lg"
              >
                {existing ? "Update Profile" : "Create Profile"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
