/**
 * AHAR X — Landing Page
 * 
 * Premium health-tech landing page with:
 *   - Hero section with product visual
 *   - Feature highlights
 *   - Call to action buttons
 *   - Clean, professional design
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  ScanLine,
  ShieldCheck,
  Sparkles,
  UserCheck,
  ChevronRight,
  Apple,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white overflow-hidden">
      {/* ── Navigation ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-sky-100 z-50"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center shadow-md shadow-sky-200">
              <Apple className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              AHAR <span className="text-sky-500">X</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-sky-600 text-sm"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
            <Button
              className="bg-sky-500 hover:bg-sky-600 text-white text-sm shadow-md shadow-sky-200"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero Section ── */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-full px-4 py-1.5 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-500" />
              <span className="text-xs font-medium text-sky-700">
                SIH 2026 Prototype
              </span>
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1]">
              AHAR{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                X
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-2xl sm:text-3xl font-semibold text-gray-700 mt-4 tracking-tight">
              Decode Your Food
            </p>

            {/* Subtitle */}
            <p className="text-lg text-gray-500 mt-5 max-w-xl mx-auto leading-relaxed">
              Scan your food. Understand the label. Make a smarter choice.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Button
                size="lg"
                className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-6 text-base font-semibold rounded-2xl shadow-lg shadow-sky-200 transition-all hover:shadow-xl hover:shadow-sky-300 hover:scale-[1.02]"
                onClick={() => navigate("/auth")}
              >
                <ScanLine className="mr-2 h-5 w-5" />
                Scan Food
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-semibold rounded-2xl border-sky-200 text-sky-700 hover:bg-sky-50 transition-all"
                onClick={() => navigate("/auth")}
              >
                Try Demo
                <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          {/* Hero Visual — Food Analysis Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-sky-100 border border-sky-100 p-8 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-sky-100 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-50 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Card 1: Scan */}
                <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100">
                  <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center mb-3 shadow-sm shadow-sky-200">
                    <ScanLine className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">Scan</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a photo of any food label
                  </p>
                </div>

                {/* Card 2: Decode */}
                <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-3 shadow-sm shadow-blue-200">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Decode
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Understand nutrition, ingredients & claims
                  </p>
                </div>

                {/* Card 3: Personalize */}
                <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mb-3 shadow-sm shadow-emerald-200">
                    <UserCheck className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Personalize
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Get advice tailored to your health goals
                  </p>
                </div>
              </div>

              {/* Analysis Preview */}
              <div className="relative mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-sky-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    AHAR Score
                  </span>
                  <span className="text-xl font-bold text-sky-600 ml-auto">
                    72/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-sky-400 to-sky-500 h-2 rounded-full"
                  />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-gray-500">
                    Moderate — Some areas need attention
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-14"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight"
            >
              Everything you need to{" "}
              <span className="text-sky-500">decode your food</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-500 mt-4 max-w-lg mx-auto"
            >
              From scanning labels to personalized insights — AHAR X makes
              understanding food simple.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-300 group"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.bgClass}`}
                >
                  <f.icon className={`h-5 w-5 ${f.iconClass}`} />
                </div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl p-10 sm:p-14 text-white shadow-2xl shadow-sky-200"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Know what you eat.
            </h2>
            <p className="text-sky-100 mt-3 text-lg">
              Understand what it means.
            </p>
            <Button
              size="lg"
              className="mt-8 bg-white text-sky-600 hover:bg-sky-50 px-10 py-6 text-base font-semibold rounded-2xl shadow-lg transition-all hover:scale-[1.02]"
              onClick={() => navigate("/auth")}
            >
              Start Scanning
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 border-t border-sky-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center">
              <Apple className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              AHAR X
            </span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            SIH 2026 Prototype — Not for medical or legal use. Regulatory
            verification is based on prototype rules.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ─── Feature Data ───────────────────────────────────────────────

const FEATURES = [
  {
    icon: ScanLine,
    title: "Smart Scan",
    description:
      "Upload a photo of any food label and let AHAR X extract and analyze the nutrition information instantly.",
    bgClass: "bg-sky-50",
    iconClass: "text-sky-600",
  },
  {
    icon: BarChart3,
    title: "Nutrition Decode",
    description:
      "Get clear, simple explanations for every nutrient — no confusing jargon, just plain language.",
    bgClass: "bg-blue-50",
    iconClass: "text-blue-600",
  },
  {
    icon: ShieldCheck,
    title: "Claim Verification",
    description:
      "Verify label claims like 'High Protein' or 'Sugar Free' against FSSAI rule engine standards.",
    bgClass: "bg-emerald-50",
    iconClass: "text-emerald-600",
  },
  {
    icon: UserCheck,
    title: "Personal Goals",
    description:
      "Set your health goals and get personalized analysis — see if a product fits your diet.",
    bgClass: "bg-violet-50",
    iconClass: "text-violet-600",
  },
  {
    icon: Apple,
    title: "Ingredient Insights",
    description:
      "Understand what each ingredient means — categorized into sugars, fats, allergens, and more.",
    bgClass: "bg-amber-50",
    iconClass: "text-amber-600",
  },
  {
    icon: Sparkles,
    title: "AHAR Score",
    description:
      "A transparent 0-100 score with a full breakdown — every point explained, nothing hidden.",
    bgClass: "bg-rose-50",
    iconClass: "text-rose-600",
  },
];
