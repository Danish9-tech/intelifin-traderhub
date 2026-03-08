import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, BarChart3, LineChart, FlaskConical, BookOpen,
  Briefcase, Bell, Users, Store, GraduationCap, Settings, Zap,
  ChevronLeft, ChevronRight, Brain
} from "lucide-react";
import { Link, useLocation, Outlet } from "react-router-dom";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BarChart3, label: "Markets", path: "/dashboard/markets" },
  { icon: LineChart, label: "Charts", path: "/dashboard/charts" },
  { icon: Brain, label: "AI Engine", path: "/dashboard/ai" },
  { icon: FlaskConical, label: "Strategies", path: "/dashboard/strategies" },
  { icon: BookOpen, label: "Journal", path: "/dashboard/journal" },
  { icon: Briefcase, label: "Portfolio", path: "/dashboard/portfolio" },
  { icon: Bell, label: "Signals", path: "/dashboard/signals" },
  { icon: Users, label: "Community", path: "/dashboard/community" },
  { icon: Store, label: "Marketplace", path: "/dashboard/marketplace" },
  { icon: GraduationCap, label: "Academy", path: "/dashboard/academy" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentNav = navItems.find((n) => n.path === location.pathname);
  const pageTitle = currentNav?.label || "Dashboard";

  return (
    <div className="flex min-h-screen bg-background">
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-40 flex flex-col overflow-hidden"
      >
        <Link to="/" className="flex items-center gap-2 p-4 h-14 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && <span className="text-sm font-bold text-foreground whitespace-nowrap">QuantumTrade AI</span>}
        </Link>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-3 border-t border-sidebar-border text-sidebar-foreground hover:text-foreground transition-colors flex items-center justify-center"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </motion.aside>

      <div style={{ marginLeft: collapsed ? 72 : 240, transition: "margin-left 0.15s cubic-bezier(0.25, 0.1, 0.25, 1)" }} className="flex-1 min-h-screen flex flex-col">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-30">
          <h1 className="text-base font-semibold text-foreground">{pageTitle}</h1>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse-glow" />
            <span className="text-muted-foreground">Markets Open</span>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
