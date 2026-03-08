import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, BarChart3, LineChart, FlaskConical, BookOpen,
  Briefcase, Bell, Users, Store, GraduationCap, Settings, Zap,
  ChevronLeft, ChevronRight, Brain
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { MarketTicker, StatCard, WatchlistWidget, CandlestickChart, RecentTrades } from "../components/dashboard/MarketWidgets";
import { AIChatWidget } from "../components/dashboard/AIChatWidget";

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

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.2 }}
        className="fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-40 flex flex-col"
      >
        <div className="flex items-center gap-2 p-4 h-16 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && <span className="text-sm font-bold text-foreground whitespace-nowrap">QuantumTrade AI</span>}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-4 border-t border-sidebar-border text-sidebar-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </motion.aside>

      {/* Main */}
      <motion.main
        animate={{ marginLeft: collapsed ? 72 : 240 }}
        transition={{ duration: 0.2 }}
        className="flex-1 min-h-screen"
      >
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 glass-strong sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Welcome back, Trader</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-sm">
              <span className="w-2 h-2 rounded-full bg-profit animate-pulse-glow" />
              <span className="text-muted-foreground">Markets Open</span>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Market Ticker */}
          <MarketTicker />

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Portfolio Value" value="$127,432.50" change="+$2,341.20 (1.87%)" up={true} delay={0} />
            <StatCard title="Today's P&L" value="+$1,892.30" change="+1.52% today" up={true} delay={0.1} />
            <StatCard title="Win Rate" value="68.4%" change="+2.1% this week" up={true} delay={0.2} />
            <StatCard title="Open Positions" value="7" change="3 in profit" up={true} delay={0.3} />
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">BTC/USD</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-2xl font-bold font-mono-num text-foreground">67,432.50</span>
                      <span className="text-sm font-mono-num text-profit">+2.34%</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {["1H", "4H", "1D", "1W"].map((tf) => (
                      <button
                        key={tf}
                        className="px-3 py-1 text-xs rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors first:bg-primary/10 first:text-primary"
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
                <CandlestickChart />
              </motion.div>
            </div>

            {/* Watchlist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <WatchlistWidget />
            </motion.div>
          </div>

          {/* Bottom Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <AIChatWidget />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <RecentTrades />
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
