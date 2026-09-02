/**
 * AHAR X — App Layout
 * 
 * Main layout wrapper for authenticated pages with bottom navigation.
 * Includes the mobile-first bottom tab bar with Home, Scan, History, Profile.
 */

import { useLocation, useNavigate } from "react-router";
import { Home, ScanLine, History, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Home", icon: Home },
  { path: "/scan", label: "Scan", icon: ScanLine },
  { path: "/history", label: "History", icon: History },
  { path: "/profile", label: "Profile", icon: User },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col">
      {/* Main content area */}
      <main className="flex-1 pb-20">{children}</main>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-sky-100 z-50">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
          {NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/dashboard" &&
                location.pathname.startsWith("/dashboard"));
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-sky-600 bg-sky-50"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all",
                    isActive && "scale-110",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-all",
                    isActive && "font-semibold",
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
